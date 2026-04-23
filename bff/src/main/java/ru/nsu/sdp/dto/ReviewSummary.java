package ru.nsu.sdp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewSummary {
    private Integer totalCount;
    private Double avgRating;
}
