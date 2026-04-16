package ru.nsu.sdp.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserProfile {
    private Integer id;
    private String email;
    private String phone;
    private String role;
    private Boolean isBlocked;
    private LocalDateTime createdAt;
    private String name;
    private String avatarUrl;
    private String bio;
    private String city;
    private Double avgRating;
    private Integer reviewsCount;
}
