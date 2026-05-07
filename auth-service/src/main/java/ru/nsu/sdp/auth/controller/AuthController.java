package ru.nsu.sdp.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nsu.sdp.auth.dto.AuthDtos;
import ru.nsu.sdp.auth.exception.AuthException;
import ru.nsu.sdp.auth.service.AuthService;

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
        AuthDtos.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/auth/register
     * Регистрирует нового пользователя и возвращает JWT-токен.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthDtos.AuthResponse> register(
            @Valid @RequestBody AuthDtos.RegisterRequest request) {
        AuthDtos.AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ---- Обработка ошибок ----

    @ExceptionHandler(AuthException.InvalidCredentials.class)
    public ResponseEntity<AuthDtos.AuthResponse> handleInvalidCredentials(AuthException.InvalidCredentials ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(AuthDtos.AuthResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(AuthException.EmailAlreadyExists.class)
    public ResponseEntity<AuthDtos.AuthResponse> handleEmailExists(AuthException.EmailAlreadyExists ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(AuthDtos.AuthResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(AuthException.UserBlocked.class)
    public ResponseEntity<AuthDtos.AuthResponse> handleBlocked(AuthException.UserBlocked ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(AuthDtos.AuthResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<AuthDtos.AuthResponse> handleValidation(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest()
                .body(AuthDtos.AuthResponse.error(message));
    }
}
