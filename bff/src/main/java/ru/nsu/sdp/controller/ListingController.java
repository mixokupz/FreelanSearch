package ru.nsu.sdp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import ru.nsu.sdp.service.ListingsService;

@RestController
@RequestMapping("/api/v1/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingsService listingsService;

    @PostMapping
    public Mono<ResponseEntity<String>> create(
            @RequestBody String body,
            @RequestHeader("Authorization") String authHeader
    ) {
        return listingsService.create(body, authHeader);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<String>> getById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        return listingsService.getById(id, authHeader);
    }

    @GetMapping("/user/{userId}")
    public Mono<ResponseEntity<String>> getByUserId(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String authHeader
    ) {
        return listingsService.getByUserId(userId, authHeader);
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<String>> update(
            @PathVariable Long id,
            @RequestBody String body,
            @RequestHeader("Authorization") String authHeader
    ) {
        return listingsService.update(id, body, authHeader);
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<String>> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        return listingsService.delete(id, authHeader);
    }
}
