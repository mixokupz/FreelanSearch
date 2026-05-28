package ru.nsu.sdp.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ProfileService {

    private final WebClient profileWebClient;

    public ProfileService(@Qualifier("profileWebClient") WebClient profileWebClient) {
        this.profileWebClient = profileWebClient;
    }

    /**
     * GET /api/v1/profiles/me → profile-service
     * Пробрасывает Authorization-заголовок и прозрачно возвращает ответ со статусом.
     */
    public Mono<ResponseEntity<String>> getOwnProfile(String authHeader) {
        return profileWebClient.get()
                .uri("/api/v1/profiles/me")
                .header("Authorization", authHeader)
                .exchangeToMono(response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(body -> ResponseEntity.status(response.statusCode()).body(body))
                );
    }

    /**
     * PUT /api/v1/profiles/me → profile-service
     */
    public Mono<ResponseEntity<String>> updateOwnProfile(String authHeader, String body) {
        return profileWebClient.put()
                .uri("/api/v1/profiles/me")
                .header("Authorization", authHeader)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .exchangeToMono(response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(responseBody -> ResponseEntity.status(response.statusCode()).body(responseBody))
                );
    }

    /**
     * GET /api/v1/profiles/{userId} → profile-service
     */
    public Mono<ResponseEntity<String>> getPublicProfile(Long userId) {
        return profileWebClient.get()
                .uri("/api/v1/profiles/{userId}", userId)
                .exchangeToMono(response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(body -> ResponseEntity.status(response.statusCode()).body(body))
                );
    }

    /**
     * GET /api/v1/profiles → profile-service
     */
    public Mono<ResponseEntity<String>> getAllPublicProfiles() {
        return profileWebClient.get()
                .uri("/api/v1/profiles")
                .exchangeToMono(response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(body -> ResponseEntity.status(response.statusCode()).body(body))
                );
    }
}
