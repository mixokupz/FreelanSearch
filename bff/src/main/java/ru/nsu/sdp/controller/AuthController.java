package ru.nsu.sdp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nsu.sdp.dto.AuthResponse;
import ru.nsu.sdp.dto.AuthRequest;
import ru.nsu.sdp.dto.ErrorResponse;
import ru.nsu.sdp.dto.RegisterRequest;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.of(null, null)
            );
        }

        AuthResponse response = AuthResponse.of("1", "mock-token-for-" + request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (request.getEmail() == null || request.getEmail().isEmpty()
                || request.getPassword() == null || request.getPassword().length() < 3
                || request.getName() == null || request.getName().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse(false, "Invalid input data"));
        }

        if ("test@example.com".equals(request.getEmail())) {
            return ResponseEntity
                    .status(409)
                    .body(new ErrorResponse(false, "User already exists"));
        }

        AuthResponse response = AuthResponse.of("1", "mock-token-for-" + request.getEmail());

        return ResponseEntity
                .status(201)
                .body(response);
    }
}