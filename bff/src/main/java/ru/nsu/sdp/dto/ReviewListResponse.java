package ru.nsu.sdp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class ReviewListResponse {
    private List<Review> items;
    private ReviewSummary summary;
}
