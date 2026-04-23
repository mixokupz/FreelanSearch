package ru.nsu.sdp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import ru.nsu.sdp.dto.AuthResponse;
import ru.nsu.sdp.dto.AuthRequest;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final WebClient webClient;

    public Mono<AuthResponse> login(AuthRequest request) {
        return webClient.post()
                .uri("/api/v1/auth/login")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AuthResponse.class);
    }
}