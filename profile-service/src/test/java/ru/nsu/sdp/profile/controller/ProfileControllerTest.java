package ru.nsu.sdp.profile.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ru.nsu.sdp.profile.config.SecurityConfig;
import ru.nsu.sdp.profile.dto.ProfileDtos;
import ru.nsu.sdp.profile.exception.ProfileException;
import ru.nsu.sdp.profile.service.ProfileService;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProfileController.class)
@Import(SecurityConfig.class)
class ProfileControllerTest {

    @Autowired MockMvc         mockMvc;
    @Autowired ObjectMapper    objectMapper;
    @MockBean  ProfileService  profileService;

    private static final String VALID_AUTH = "Bearer valid-jwt-token";

    // ─── GET /api/v1/profiles/me ───────────────────────────────────────────────

    @Test
    void getOwnProfile_validToken_returns200WithProfileData() throws Exception {
        when(profileService.getOwnProfile(VALID_AUTH)).thenReturn(ownProfile());

        mockMvc.perform(get("/api/v1/profiles/me")
                        .header("Authorization", VALID_AUTH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("user@test.com"))
                .andExpect(jsonPath("$.data.displayName").value("Test User"));
    }

    @Test
    void getOwnProfile_missingAuthorizationHeader_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/profiles/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getOwnProfile_invalidToken_returns401() throws Exception {
        when(profileService.getOwnProfile(any())).thenThrow(new ProfileException.InvalidToken());

        mockMvc.perform(get("/api/v1/profiles/me")
                        .header("Authorization", "Bearer bad-token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getOwnProfile_userNotFound_returns404() throws Exception {
        when(profileService.getOwnProfile(any())).thenThrow(new ProfileException.UserNotFound());

        mockMvc.perform(get("/api/v1/profiles/me")
                        .header("Authorization", VALID_AUTH))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getOwnProfile_blockedUser_returns403() throws Exception {
        when(profileService.getOwnProfile(any())).thenThrow(new ProfileException.UserBlocked());

        mockMvc.perform(get("/api/v1/profiles/me")
                        .header("Authorization", VALID_AUTH))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }

    // ─── PUT /api/v1/profiles/me ───────────────────────────────────────────────

    @Test
    void updateOwnProfile_validRequest_returns200WithUpdatedData() throws Exception {
        when(profileService.updateOwnProfile(eq(VALID_AUTH), any())).thenReturn(ownProfile());

        mockMvc.perform(put("/api/v1/profiles/me")
                        .header("Authorization", VALID_AUTH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"displayName":"New Name","city":"SPb"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void updateOwnProfile_emptyDisplayName_returns400() throws Exception {
        // displayName с length < 1 нарушает @Size(min=1)
        mockMvc.perform(put("/api/v1/profiles/me")
                        .header("Authorization", VALID_AUTH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"displayName":""}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void updateOwnProfile_invalidAvatarUrl_returns400() throws Exception {
        mockMvc.perform(put("/api/v1/profiles/me")
                        .header("Authorization", VALID_AUTH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"avatarUrl":"not-a-url"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void updateOwnProfile_missingAuthHeader_returns401() throws Exception {
        mockMvc.perform(put("/api/v1/profiles/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"displayName":"Name"}
                                """))
                .andExpect(status().isUnauthorized());
    }

    // ─── GET /api/v1/profiles/{userId} ────────────────────────────────────────

    @Test
    void getPublicProfile_existingUser_returns200WithPublicData() throws Exception {
        when(profileService.getPublicProfile(1L)).thenReturn(publicProfile());

        mockMvc.perform(get("/api/v1/profiles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.displayName").value("Test User"));
    }

    @Test
    void getPublicProfile_unknownUser_returns404() throws Exception {
        when(profileService.getPublicProfile(999L)).thenThrow(new ProfileException.UserNotFound());

        mockMvc.perform(get("/api/v1/profiles/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getPublicProfile_blockedUser_returns403() throws Exception {
        when(profileService.getPublicProfile(2L)).thenThrow(new ProfileException.UserBlocked());

        mockMvc.perform(get("/api/v1/profiles/2"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }

    // ─── GET /api/v1/profiles ─────────────────────────────────────────────────

    @Test
    void getAllPublicProfiles_returns200WithList() throws Exception {
        when(profileService.getAllPublicProfiles()).thenReturn(List.of(publicProfile()));

        mockMvc.perform(get("/api/v1/profiles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].displayName").value("Test User"));
    }

    @Test
    void getAllPublicProfiles_emptyList_returns200WithEmptyArray() throws Exception {
        when(profileService.getAllPublicProfiles()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/profiles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    private ProfileDtos.OwnProfileResponse ownProfile() {
        return ProfileDtos.OwnProfileResponse.builder()
                .id(1L)
                .email("user@test.com")
                .phone("+79001234567")
                .role("user")
                .isBlocked(false)
                .createdAt(LocalDateTime.now())
                .displayName("Test User")
                .city("Moscow")
                .avgRating(4.5)
                .reviewsCount(10)
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private ProfileDtos.PublicProfileResponse publicProfile() {
        return ProfileDtos.PublicProfileResponse.builder()
                .id(1L)
                .email("user@test.com")
                .role("user")
                .displayName("Test User")
                .city("Moscow")
                .avgRating(4.5)
                .reviewsCount(10)
                .updatedAt(LocalDateTime.now())
                .build();
    }
}
