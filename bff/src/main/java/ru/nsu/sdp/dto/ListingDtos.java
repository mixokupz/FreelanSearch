package ru.nsu.sdp.dto;

import lombok.Data;

import java.math.BigDecimal;

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
}
