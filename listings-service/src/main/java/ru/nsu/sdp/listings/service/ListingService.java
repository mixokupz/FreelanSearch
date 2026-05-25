package ru.nsu.sdp.listings.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.nsu.sdp.listings.dto.ListingDtos;
import ru.nsu.sdp.listings.entity.Listing;
import ru.nsu.sdp.listings.exception.ListingException;
import ru.nsu.sdp.listings.repository.ListingRepository;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;

    @Transactional
    public ListingDtos.ListingData create(ListingDtos.CreateListingRequest request, Long userId) {
        Listing listing = new Listing();
        listing.setUserId(userId);
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setPriceType(request.getPriceType());
        listing.setStatus("pending");

        Listing saved = listingRepository.save(listing);
        return ListingDtos.ListingData.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ListingDtos.ListingData getById(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(ListingException.NotFound::new);
        return ListingDtos.ListingData.fromEntity(listing);
    }

    @Transactional
    public ListingDtos.ListingData update(Long id, ListingDtos.UpdateListingRequest request, Long userId) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(ListingException.NotFound::new);

        if (!listing.getUserId().equals(userId)) {
            throw new ListingException.Forbidden();
        }

        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setPriceType(request.getPriceType());
        listing.setStatus(request.getStatus());

        Listing updated = listingRepository.save(listing);
        return ListingDtos.ListingData.fromEntity(updated);
    }
    @Transactional
    public void delete(Long id, Long userId) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(ListingException.NotFound::new);

        if (!listing.getUserId().equals(userId)) {
            throw new ListingException.Forbidden();
        }

        listingRepository.delete(listing);
    }
}
