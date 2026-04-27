package ru.nsu.sdp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.nsu.sdp.dto.ApiResponse;
import ru.nsu.sdp.dto.UserProfile;
import ru.nsu.sdp.service.ProfileService;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final ProfileService profileService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserProfile>> getCurrentUserProfile(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        ApiResponse<UserProfile> response = profileService.getCurrentUserProfile(authorizationHeader);
        return ResponseEntity.ok(response);
    }
}
