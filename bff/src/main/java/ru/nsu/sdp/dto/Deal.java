package ru.nsu.sdp.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Deal {
    private Integer id;
    private DealUser client;
    private DealUser executor;
    private DealService service;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    @Data
    public static class DealUser {
        private Integer id;
        private String displayName;
        private String avatarUrl;
    }

    @Data
    public static class DealService {
        private Integer id;
        private String title;
    }
}
