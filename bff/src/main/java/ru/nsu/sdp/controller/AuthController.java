package ru.nsu.sdp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import ru.nsu.sdp.dto.AuthResponse;
import ru.nsu.sdp.dto.AuthRequest;
import ru.nsu.sdp.dto.ErrorResponse;
import ru.nsu.sdp.dto.RegisterRequest;
import ru.nsu.sdp.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@RequestBody AuthRequest request) {
        return authService.login(request)
                .map(ResponseEntity::ok)
                .onErrorResume(ex -> {
                    AuthResponse err = AuthResponse.of(null, null);
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err));
                });
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<AuthResponse>> register(@RequestBody RegisterRequest request) {
        return authService.register(request)
                .map(body -> ResponseEntity.status(HttpStatus.CREATED).body(body))
                .onErrorResume(ex -> {
                    // 409 если email занят, иначе 400
                    String msg = ex.getMessage() != null ? ex.getMessage() : "Registration failed";
                    AuthResponse err = AuthResponse.of(null, null);
                    HttpStatus status = msg.contains("уже существует")
                            ? HttpStatus.CONFLICT
                            : HttpStatus.BAD_REQUEST;
                    return Mono.just(ResponseEntity.status(status).body(err));
                });
    }
}