package ru.nsu.sdp.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nsu.sdp.auth.dto.AuthDtos;
import ru.nsu.sdp.auth.exception.AuthException;
import ru.nsu.sdp.auth.service.AuthService;

@Slf4j  // Добавляем логгер
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/v1/auth/login
     * Проверяет учётные данные и возвращает JWT-токен.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthDtos.AuthResponse> login(
            @Valid @RequestBody AuthDtos.LoginRequest request) {
        log.info("BFF_TO_AUTH: login request received - email={}", request.getEmail());
        
        AuthDtos.AuthResponse response = authService.login(request);
        
        log.info("AUTH_TO_BFF: login response sent - email={}, success={}", 
                 request.getEmail(), response.isSuccess());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/auth/register
     * Регистрирует нового пользователя и возвращает JWT-токен.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthDtos.AuthResponse> register(
            @Valid @RequestBody AuthDtos.RegisterRequest request) {
        log.info("BFF_TO_AUTH: register request received - email={}, name={}, password={}", 
                 request.getEmail(), request.getName(), request.getPassword());
        
        AuthDtos.AuthResponse response = authService.register(request);
        
        log.info("AUTH_TO_BFF: register response sent - email={}, success={}", 
                 request.getEmail(), response.isSuccess());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ---- Обработка ошибок ----

    @ExceptionHandler(AuthException.InvalidCredentials.class)
    public ResponseEntity<AuthDtos.AuthResponse> handleInvalidCredentials(AuthException.InvalidCredentials ex) {
        log.warn("AUTH_CONTROLLER: invalid credentials error - {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(AuthDtos.AuthResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(AuthException.EmailAlreadyExists.class)
    public ResponseEntity<AuthDtos.AuthResponse> handleEmailExists(AuthException.EmailAlreadyExists ex) {
        log.warn("AUTH_CONTROLLER: email already exists error - {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(AuthDtos.AuthResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(AuthException.UserBlocked.class)
    public ResponseEntity<AuthDtos.AuthResponse> handleBlocked(AuthException.UserBlocked ex) {
        log.warn("AUTH_CONTROLLER: user blocked error - {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(AuthDtos.AuthResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<AuthDtos.AuthResponse> handleValidation(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        log.warn("AUTH_CONTROLLER: validation error - {}", message);
        return ResponseEntity.badRequest()
                .body(AuthDtos.AuthResponse.error(message));
    }
}
