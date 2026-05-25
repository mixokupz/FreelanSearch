package ru.nsu.sdp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import ru.nsu.sdp.dto.ListingDtos;

@Service
@RequiredArgsConstructor
public class ListingsService {

    @Qualifier("listingsWebClient")
    private final WebClient webClient;

    public Mono<ResponseEntity<String>> create(ListingDtos.CreateListingRequest request, String authHeader) {
        return webClient.post()
                .uri("/api/v1/listings")
                .headers(headers -> {
                    if (authHeader != null) {
                        headers.set("Authorization", authHeader);
                    }
                })
                .bodyValue(request)
                .exchangeToMono(response -> response.toEntity(String.class));
    }

    public Mono<ResponseEntity<String>> getById(Long id, String authHeader) {
        return webClient.get()
                .uri("/api/v1/listings/{id}", id)
                .headers(headers -> {
                    if (authHeader != null) {
                        headers.set("Authorization", authHeader);
                    }
                })
                .exchangeToMono(response -> response.toEntity(String.class));
    }

    public Mono<ResponseEntity<String>> update(Long id, ListingDtos.UpdateListingRequest request, String authHeader) {
        return webClient.put()
                .uri("/api/v1/listings/{id}", id)
                .headers(headers -> {
                    if (authHeader != null) {
                        headers.set("Authorization", authHeader);
                    }
                })
                .bodyValue(request)
                .exchangeToMono(response -> response.toEntity(String.class));
    }

    public Mono<ResponseEntity<String>> delete(Long id, String authHeader) {
        return webClient.delete()
                .uri("/api/v1/listings/{id}", id)
                .headers(headers -> {
                    if (authHeader != null) {
                        headers.set("Authorization", authHeader);
                    }
                })
                .exchangeToMono(response -> response.toEntity(String.class));
    }
}
