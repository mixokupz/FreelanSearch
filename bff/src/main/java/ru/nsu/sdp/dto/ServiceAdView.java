package ru.nsu.sdp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ServiceAdView {
    private Integer id;
    private String title;
    private String description;
    private Double price;

    @JsonProperty("price_type")
    private String priceType;

    private String status;
    private UserProfile author;
    private ImagePayload image;

    @Data
    public static class ImagePayload {
        @JsonProperty("media_id")
        private String mediaId;

        @JsonProperty("content_type")
        private String contentType;

        private String base64;
    }
}
