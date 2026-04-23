package ru.nsu.sdp.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserProfile {
    private Integer id;
    private String email;
    private String phone;
    private String role;

    @JsonProperty("is_blocked")
    private Boolean isBlocked;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    private String name;

    @JsonProperty("avatar_url")
    private String avatarUrl;

    private String bio;
    private String city;

    @JsonProperty("avg_rating")
    private Double avgRating;

    @JsonProperty("reviews_count")
    private Integer reviewsCount;
}
