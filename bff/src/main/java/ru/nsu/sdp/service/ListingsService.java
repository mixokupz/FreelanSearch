package ru.nsu.sdp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ListingsService {

    private final WebClient webClient;

    public ListingsService(@Qualifier("listingsWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<ResponseEntity<String>> create(
            String body,
            String authHeader
    ) {
        return webClient.post()
                .uri("/api/v1/listings")
                .header("Authorization", authHeader)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .exchangeToMono(response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(responseBody -> ResponseEntity.status(response.statusCode()).body(responseBody))
                );
    }

    public Mono<ResponseEntity<String>> getById(
            Long id
           
    ) {
        return webClient.get()
                .uri("/api/v1/listings/{id}", id)
                .exchangeToMono(response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(responseBody -> ResponseEntity.status(response.statusCode()).body(responseBody))
                );
    }

    public Mono<ResponseEntity<String>> update(
            Long id,
            String body,
            String authHeader
    ) {
        return webClient.put()
                .uri("/api/v1/listings/{id}", id)
                .header("Authorization", authHeader)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .exchangeToMono(response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(responseBody -> ResponseEntity.status(response.statusCode()).body(responseBody))
                );
    }

    public Mono<ResponseEntity<String>> delete(
            Long id,
            String authHeader
    ) {
        return webClient.delete()
                .uri("/api/v1/listings/{id}", id)
                .header("Authorization", authHeader)
                .exchangeToMono(response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(body -> ResponseEntity.status(response.statusCode()).body(body))
                );
    }

    public Mono<ResponseEntity<String>> getByUserId(
            Long userId
           
    ) {
        return webClient.get()
                .uri("/api/v1/listings/user/{userId}", userId)
                .exchangeToMono(response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(body -> ResponseEntity.status(response.statusCode()).body(body))
                );
    }

     public Mono<ResponseEntity<String>> getAll() {
        var requestSpec = webClient.get().uri("/api/v1/listings");

        return requestSpec.exchangeToMono(response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(body -> ResponseEntity.status(response.statusCode()).body(body))
                );
    }
}
