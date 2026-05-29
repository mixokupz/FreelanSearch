package ru.nsu.sdp.profile.dto;

import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

public class ProfileDtos {

    /**
     * Полный профиль (собственный) — включает email и phone.
     */
    @Data
    @Builder
    public static class OwnProfileResponse {
        // Поля из таблицы users
        private Long id;
        private String email;
        private String phone;
        private String role;
        private boolean isBlocked;
        private LocalDateTime createdAt;

        // Поля из таблицы profiles
        private String displayName;
        private String avatarUrl;
        private String bio;
        private String city;
        private Double avgRating;
        private Integer reviewsCount;
        private LocalDateTime updatedAt;
    }

    /**
     * Публичный профиль другого пользователя — теперь включает email и phone.
     */
    @Data
    @Builder
    public static class PublicProfileResponse {
        // Поля из users
        private Long id;
        private String email;
        private String phone;
        private String role;

        // Поля из profiles
        private String displayName;
        private String avatarUrl;
        private String bio;
        private String city;
        private Double avgRating;
        private Integer reviewsCount;
        private LocalDateTime updatedAt;
    }

    /**
     * Тело запроса на обновление профиля.
     * Все поля опциональны — обновляются только переданные (не null).
     */
    @Data
    public static class UpdateProfileRequest {

        @Size(min = 1, max = 100, message = "display_name должен содержать от 1 до 100 символов")
        private String displayName;

        @URL(message = "avatar_url должен быть корректным URL")
        @Size(max = 500, message = "avatar_url не должен превышать 500 символов")
        private String avatarUrl;

        private String bio;

        @Size(max = 100, message = "city не должен превышать 100 символов")
        private String city;
    }

    /**
     * Унифицированная обёртка ответа.
     */
    @Data
    public static class ApiResponse<T> {
        private boolean success;
        private T data;

        public static <T> ApiResponse<T> ok(T data) {
            ApiResponse<T> r = new ApiResponse<>();
            r.success = true;
            r.data = data;
            return r;
        }

        public static <T> ApiResponse<T> error(T data) {
            ApiResponse<T> r = new ApiResponse<>();
            r.success = false;
            r.data = data;
            return r;
        }
    }

    /**
     * Тело ошибки.
     */
    @Data
    public static class ErrorData {
        private final String message;
    }
}
