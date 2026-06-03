package ru.nsu.sdp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import ru.nsu.sdp.dto.AuthResponse;
import ru.nsu.sdp.dto.AuthRequest;
import ru.nsu.sdp.dto.RegisterRequest;
import ru.nsu.sdp.service.AuthService;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@RequestBody AuthRequest request) {
        log.info("FRONTEND_REQUEST_TO_BFF: login - email={}, password={}", 
                 request.getEmail(), 
                 request.getPassword());  // ← пароль в открытом виде
        
        return authService.login(request)
                .doOnSuccess(response -> {
                    log.info("BFF_RESPONSE_TO_FRONTEND: login - success=true, email={}", request.getEmail());
                })
                .doOnError(ex -> {
                    log.error("BFF_ERROR_TO_FRONTEND: login - email={}, error={}", 
                              request.getEmail(), ex.getMessage());
                })
                .map(ResponseEntity::ok)
                .onErrorResume(ex -> {
                    AuthResponse err = AuthResponse.of(null, null);
                    log.warn("Login failed for email: {}", request.getEmail());
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err));
                });
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<AuthResponse>> register(@RequestBody RegisterRequest request) {
        // Логируем входящий запрос от фронта (с паролем в открытом виде)
        log.info("FRONTEND_REQUEST_TO_BFF: register - email={}, name={}, password={}", 
                 request.getEmail(), 
                 request.getName(),
                 request.getPassword());  // ← пароль в открытом виде
        
        return authService.register(request)
                .doOnSuccess(response -> {
                    log.info("BFF_RESPONSE_TO_FRONTEND: register - success=true, email={}", request.getEmail());
                })
                .doOnError(ex -> {
                    log.error("BFF_ERROR_TO_FRONTEND: register - email={}, error={}", 
                              request.getEmail(), ex.getMessage());
                })
                .map(body -> ResponseEntity.status(HttpStatus.CREATED).body(body))
                .onErrorResume(ex -> {
                    String msg = ex.getMessage() != null ? ex.getMessage() : "Registration failed";
                    AuthResponse err = AuthResponse.of(null, null);
                    HttpStatus status = msg.contains("уже существует")
                            ? HttpStatus.CONFLICT
                            : HttpStatus.BAD_REQUEST;
                    log.warn("Registration failed for email: {} - {}", request.getEmail(), msg);
                    return Mono.just(ResponseEntity.status(status).body(err));
                });
    }
}
