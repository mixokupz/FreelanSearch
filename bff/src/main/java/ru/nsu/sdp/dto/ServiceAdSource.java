package ru.nsu.sdp.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ServiceAdSource {
    private Integer id;
    private String title;
    private String description;
    private Double price;

    @JsonProperty("price_type")
    private String priceType;

    private String status;

    @JsonAlias({"user_id", "author_id", "freelancer_id"})
    private Integer authorId;

    @JsonAlias({"media_id", "image_id", "preview_media_id"})
    private String mediaId;

    private List<ServicePhotoRef> photos;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ServicePhotoRef {
        private Integer id;

        @JsonAlias({"media_id", "image_id"})
        private String mediaId;

        private String url;

        @JsonProperty("sort_order")
        private Integer sortOrder;
    }
}
