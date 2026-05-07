package ru.nsu.sdp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.nsu.sdp.dto.ApiResponse;
import ru.nsu.sdp.dto.UserProfile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserProfile>> getCurrentUserProfile() {
        UserProfile profile = new UserProfile();
        profile.setId(1);
        profile.setEmail("user@example.com");
        profile.setPhone("+7-999-123-45-67");
        profile.setRole("user");
        profile.setIsBlocked(false);
        profile.setCreatedAt(LocalDateTime.now().minusDays(30));
        profile.setName("John Doe");
        profile.setAvatarUrl("https://example.com/avatar.jpg");
        profile.setBio("Experienced freelancer");
        profile.setCity("Moscow");
        profile.setAvgRating(4.8);
        profile.setReviewsCount(25);

        ApiResponse<UserProfile> response = new ApiResponse<>("success", profile);
        return ResponseEntity.ok(response);
    }
}
