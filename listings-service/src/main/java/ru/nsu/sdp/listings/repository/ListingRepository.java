package ru.nsu.sdp.listings.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nsu.sdp.listings.entity.Listing;

import java.util.List;
import java.util.Optional;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    Optional<Listing> findByIdAndUserId(Long id, Long userId);
    List<Listing> findAllByUserId(Long userId);
}
