package ru.nsu.sdp.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserService {
    private Integer id;
    private String title;
    private String description;
    private Double price;
    private String priceType;
    private String status;
    private ServiceCategory category;
    private List<ServicePhoto> photos;
    private List<ServiceTag> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class ServiceCategory {
        private Integer id;
        private String name;
        private String slug;
    }

    @Data
    public static class ServicePhoto {
        private Integer id;
        private String url;
        private Integer sortOrder;
    }

    @Data
    public static class ServiceTag {
        private Integer id;
        private String name;
        private String slug;
    }
}
