package ru.nsu.sdp.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email обязателен")
        @Email(message = "Неверный формат email")
        private String email;

        @NotBlank(message = "Пароль обязателен")
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Email обязателен")
        @Email(message = "Неверный формат email")
        private String email;

        @NotBlank(message = "Пароль обязателен")
        @Size(min = 6, message = "Пароль должен содержать минимум 6 символов")
        private String password;

        @NotBlank(message = "Имя обязательно")
        private String name;
    }

    @Data
    public static class AuthResponse {
        private boolean success;
        private Object data;

        public static AuthResponse ok(String userId, String token) {
            AuthResponse r = new AuthResponse();
            r.success = true;
            r.data = new TokenData(userId, token);
            return r;
        }

        public static AuthResponse error(String message) {
            AuthResponse r = new AuthResponse();
            r.success = false;
            r.data = new ErrorData(message);
            return r;
        }
    }

    @Data
    public static class TokenData {
        private final String userId;
        private final String status = "success";
        private final String token;
    }

    @Data
    public static class ErrorData {
        private final String message;
    }
}
