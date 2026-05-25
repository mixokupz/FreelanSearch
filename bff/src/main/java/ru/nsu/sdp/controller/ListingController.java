package ru.nsu.sdp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import ru.nsu.sdp.dto.ListingDtos;
import ru.nsu.sdp.service.ListingsService;

@RestController
@RequestMapping("/api/v1/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingsService listingsService;

    @PostMapping
    public Mono<ResponseEntity<String>> create(
            @RequestBody ListingDtos.CreateListingRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        return listingsService.create(request, authHeader);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<String>> getById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        return listingsService.getById(id, authHeader);
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<String>> update(
            @PathVariable Long id,
            @RequestBody ListingDtos.UpdateListingRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        return listingsService.update(id, request, authHeader);
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<String>> delete(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        return listingsService.delete(id, authHeader);
    }
}
