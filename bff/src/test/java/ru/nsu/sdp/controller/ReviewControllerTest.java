package ru.nsu.sdp.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ru.nsu.sdp.dto.ApiResponse;
import ru.nsu.sdp.dto.ReviewListResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ReviewControllerTest {

    @Test
    void getReviewsReturnsBadRequestWhenRoleMissing() {
        ReviewController controller = new ReviewController();

        ResponseEntity<ApiResponse<ReviewListResponse>> entity = controller.getReviews(null);

        assertEquals(HttpStatus.BAD_REQUEST, entity.getStatusCode());
        assertNotNull(entity.getBody());
        assertEquals("error", entity.getBody().getStatus());
        assertNull(entity.getBody().getData());
    }

    @Test
    void getReviewsFiltersByRoleAndBuildsSummary() {
        ReviewController controller = new ReviewController();

        ResponseEntity<ApiResponse<ReviewListResponse>> entity = controller.getReviews("executor");

        assertEquals(HttpStatus.OK, entity.getStatusCode());
        assertNotNull(entity.getBody());
        assertEquals("success", entity.getBody().getStatus());
        assertNotNull(entity.getBody().getData());
        assertEquals(2, entity.getBody().getData().getItems().size());
        assertEquals(2, entity.getBody().getData().getSummary().getTotalCount());
        assertEquals(5.0, entity.getBody().getData().getSummary().getAvgRating());
        assertTrue(entity.getBody().getData().getItems().stream()
                .allMatch(review -> "executor".equals(review.getTargetRole())));
    }
}
