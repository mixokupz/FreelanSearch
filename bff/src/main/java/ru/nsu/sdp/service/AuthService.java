package ru.nsu.sdp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import ru.nsu.sdp.dto.AuthResponse;
import ru.nsu.sdp.dto.AuthRequest;
import ru.nsu.sdp.dto.RegisterRequest;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final WebClient webClient;

    /**
     * Перенаправляет запрос на вход в auth-service.
     * Ответ (включая статус ошибки) прозрачно передаётся клиенту.
     */
    public Mono<AuthResponse> login(AuthRequest request) {
        return webClient.post()
                .uri("/api/v1/auth/login")
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, resp ->
                        resp.bodyToMono(AuthResponse.class)
                                .flatMap(Mono::error)
                )
                .bodyToMono(AuthResponse.class);
    }

    /**
     * Перенаправляет запрос на регистрацию в auth-service.
     */
    public Mono<AuthResponse> register(RegisterRequest request) {
        return webClient.post()
                .uri("/api/v1/auth/register")
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, resp ->
                        resp.bodyToMono(AuthResponse.class)
                                .flatMap(Mono::error)
                )
                .bodyToMono(AuthResponse.class);
    }
}