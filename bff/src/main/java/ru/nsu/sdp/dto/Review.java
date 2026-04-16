package ru.nsu.sdp.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Review {
    private Integer id;
    private Integer dealId;
    private Integer rating;
    private String comment;
    private ReviewAuthor author;
    private String targetRole;
    private LocalDateTime createdAt;

    @Data
    public static class ReviewAuthor {
        private Integer id;
        private String displayName;
        private String avatarUrl;
    }
}
