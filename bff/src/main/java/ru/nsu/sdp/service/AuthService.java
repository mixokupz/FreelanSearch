package ru.nsu.sdp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.slf4j.MDC;
import reactor.core.publisher.Mono;
import ru.nsu.sdp.dto.AuthResponse;
import ru.nsu.sdp.dto.AuthRequest;
import ru.nsu.sdp.dto.RegisterRequest;

@Slf4j  // Добавляем логгер
@Service
@RequiredArgsConstructor
public class AuthService {

    private final WebClient webClient;

    public Mono<AuthResponse> login(AuthRequest request) {
        String requestId = MDC.get("requestId");
        // 1. Логируем что отправляем в auth-service
        log.info("BFF_TO_AUTH_SERVICE: login request - email={}, password={}, url=/api/v1/auth/login", 
                 request.getEmail(), 
                 request.getPassword());
        
        long startTime = System.currentTimeMillis();
        
        return webClient.post()
                .uri("/api/v1/auth/login")
                .headers(headers -> addRequestId(headers, requestId))
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, resp -> {
                    logWithRequestId(requestId, () -> log.warn("AUTH_SERVICE_ERROR: login - status={}, email={}", 
                             resp.statusCode().value(), request.getEmail()));
                    return resp.bodyToMono(String.class)
                            .flatMap(errorBody -> Mono.error(new RuntimeException("Auth error: " + errorBody)));
                })
                .bodyToMono(AuthResponse.class)
                .doOnSuccess(response -> {
                    long duration = System.currentTimeMillis() - startTime;
                    // 2. Логируем что получили от auth-service (успешно)
                    String token = response.getData() != null ? response.getData().getToken() : null;
                    logWithRequestId(requestId, () -> log.info("AUTH_SERVICE_TO_BFF: login response - email={}, success={}, token={}, duration={}ms", 
                             request.getEmail(),
                             response.getSuccess(),
                             token,
                             duration));
                })
                .doOnError(ex -> {
                    long duration = System.currentTimeMillis() - startTime;
                    // 3. Логируем что получили от auth-service (ошибка)
                    logWithRequestId(requestId, () -> log.error("AUTH_SERVICE_TO_BFF: login error - email={}, duration={}ms, error={}", 
                              request.getEmail(), duration, ex.getMessage()));
                });
    }

    public Mono<AuthResponse> register(RegisterRequest request) {
        String requestId = MDC.get("requestId");
        // 1. Логируем что отправляем в auth-service
        log.info("BFF_TO_AUTH_SERVICE: register request - email={}, name={}, password={}, url=/api/v1/auth/register", 
                 request.getEmail(), 
                 request.getName(),
                 request.getPassword());
        
        long startTime = System.currentTimeMillis();
        
        return webClient.post()
                .uri("/api/v1/auth/register")
                .headers(headers -> addRequestId(headers, requestId))
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, resp -> {
                    logWithRequestId(requestId, () -> log.warn("AUTH_SERVICE_ERROR: register - status={}, email={}", 
                             resp.statusCode().value(), request.getEmail()));
                    return resp.bodyToMono(String.class)
                            .flatMap(errorBody -> Mono.error(new RuntimeException("Auth error: " + errorBody)));
                })
                .bodyToMono(AuthResponse.class)
                .doOnSuccess(response -> {
                    long duration = System.currentTimeMillis() - startTime;
                    // 2. Логируем что получили от auth-service (успешно)
                    String token = response.getData() != null ? response.getData().getToken() : null;
                    logWithRequestId(requestId, () -> log.info("AUTH_SERVICE_TO_BFF: register response - email={}, success={}, token={}, duration={}ms", 
                             request.getEmail(),
                             response.getSuccess(),
                             token,
                             duration));
                })
                .doOnError(ex -> {
                    long duration = System.currentTimeMillis() - startTime;
                    // 3. Логируем что получили от auth-service (ошибка)
                    logWithRequestId(requestId, () -> log.error("AUTH_SERVICE_TO_BFF: register error - email={}, duration={}ms, error={}", 
                              request.getEmail(), duration, ex.getMessage()));
                });
    }

    private void addRequestId(HttpHeaders headers, String requestId) {
        if (requestId == null || requestId.isBlank()) {
            return;
        }
        headers.set("X-Request-Id", requestId);
        headers.set("X-B3-TraceId", requestId);
    }

    private void logWithRequestId(String requestId, Runnable action) {
        if (requestId == null || requestId.isBlank()) {
            action.run();
            return;
        }
        try (MDC.MDCCloseable ignored = MDC.putCloseable("requestId", requestId)) {
            action.run();
        }
    }
}
