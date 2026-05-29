package ru.nsu.sdp.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ListingDtos {

    @Data
    public static class CreateListingRequest {
        private String title;

        private String description;

        private BigDecimal price;

        private String priceType;
    }

    @Data
    public static class UpdateListingRequest {
        private String title;

        private String description;

        private BigDecimal price;

        private String priceType;

        private String status;
    }

    @Data
    public static class ApiResponse<T> {
        private boolean success;
        private T data;
    }

    @Data
    public static class ListingData {
        private Long id;
        private Long userId;
        private String title;
        private String description;
        private BigDecimal price;
        private String priceType;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    public static class ErrorData {
        private String message;
    }

    @Data
    public static class MessageData {
        private String message;
    }

}
