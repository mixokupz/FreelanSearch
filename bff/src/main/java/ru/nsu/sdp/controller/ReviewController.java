package ru.nsu.sdp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.nsu.sdp.dto.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ReviewListResponse>> getReviews(
            @RequestParam(required = false) String role) {

        if (role == null || role.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>("error", null)
            );
        }

        List<Review> mockReviews = getMockReviews();

        List<Review> filteredReviews = mockReviews.stream()
                .filter(review -> role.equals(review.getTargetRole()))
                .collect(Collectors.toList());

        int totalCount = filteredReviews.size();
        double avgRating = filteredReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        ReviewSummary summary = new ReviewSummary(totalCount, avgRating);
        ReviewListResponse data = new ReviewListResponse(filteredReviews, summary);
        ApiResponse<ReviewListResponse> response = new ApiResponse<>("success", data);
        return ResponseEntity.ok(response);
    }

    private List<Review> getMockReviews() {
        List<Review> reviews = new ArrayList<>();

        Review review1 = new Review();
        review1.setId(1);
        review1.setDealId(1);
        review1.setRating(5);
        review1.setComment("Excellent work! Very professional");

        Review.ReviewAuthor author1 = new Review.ReviewAuthor();
        author1.setId(2);
        author1.setDisplayName("Jane Smith");
        author1.setAvatarUrl("https://example.com/avatar2.jpg");
        review1.setAuthor(author1);

        review1.setTargetRole("executor");
        review1.setCreatedAt(LocalDateTime.now().minusDays(2));

        reviews.add(review1);

        Review review2 = new Review();
        review2.setId(2);
        review2.setDealId(2);
        review2.setRating(4);
        review2.setComment("Good work, on time");

        Review.ReviewAuthor author2 = new Review.ReviewAuthor();
        author2.setId(3);
        author2.setDisplayName("Bob Johnson");
        author2.setAvatarUrl("https://example.com/avatar3.jpg");
        review2.setAuthor(author2);

        review2.setTargetRole("client");
        review2.setCreatedAt(LocalDateTime.now().minusDays(1));

        reviews.add(review2);

        Review review3 = new Review();
        review3.setId(3);
        review3.setDealId(1);
        review3.setRating(5);
        review3.setComment("Perfect execution");

        Review.ReviewAuthor author3 = new Review.ReviewAuthor();
        author3.setId(4);
        author3.setDisplayName("Alice Brown");
        author3.setAvatarUrl("https://example.com/avatar4.jpg");
        review3.setAuthor(author3);

        review3.setTargetRole("executor");
        review3.setCreatedAt(LocalDateTime.now().minusDays(5));

        reviews.add(review3);

        return reviews;
    }
}
