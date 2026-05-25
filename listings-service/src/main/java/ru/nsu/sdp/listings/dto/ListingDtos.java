package ru.nsu.sdp.listings.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import ru.nsu.sdp.listings.entity.Listing;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ListingDtos {

    @Data
    public static class CreateListingRequest {
        @NotBlank(message = "Название обязательно")
        private String title;

        @NotBlank(message = "Описание обязательно")
        private String description;

        @DecimalMin(value = "0.0", inclusive = false, message = "Цена должна быть больше 0")
        private BigDecimal price;

        @NotBlank(message = "Тип цены обязателен")
        private String priceType;
    }

    @Data
    public static class UpdateListingRequest {
        @NotBlank(message = "Название обязательно")
        private String title;

        @NotBlank(message = "Описание обязательно")
        private String description;

        @DecimalMin(value = "0.0", inclusive = false, message = "Цена должна быть больше 0")
        private BigDecimal price;

        @NotBlank(message = "Тип цены обязателен")
        private String priceType;

        @NotBlank(message = "Статус обязателен")
        private String status;
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

    @Data
    public static class ListingData {
        private final Long id;
        private final Long userId;
        private final String title;
        private final String description;
        private final BigDecimal price;
        private final String priceType;
        private final String status;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;

        public static ListingData fromEntity(Listing listing) {
            return new ListingData(
                    listing.getId(),
                    listing.getUserId(),
                    listing.getTitle(),
                    listing.getDescription(),
                    listing.getPrice(),
                    listing.getPriceType(),
                    listing.getStatus(),
                    listing.getCreatedAt(),
                    listing.getUpdatedAt()
            );
        }
    }

    @Data
    public static class ErrorData {
        private final String message;
    }

    @Data
    public static class MessageData {
        private final String message;
    }
}
