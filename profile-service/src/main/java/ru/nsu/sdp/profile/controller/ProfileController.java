package ru.nsu.sdp.profile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import ru.nsu.sdp.profile.dto.ProfileDtos;
import ru.nsu.sdp.profile.exception.ProfileException;
import ru.nsu.sdp.profile.service.ProfileService;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /**
     * GET /api/v1/profiles/me
     * Возвращает полный профиль аутентифицированного пользователя.
     * Требует: Authorization: Bearer <token>
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileDtos.ApiResponse<ProfileDtos.OwnProfileResponse>> getOwnProfile(
            @RequestHeader("Authorization") String authHeader) {
        ProfileDtos.OwnProfileResponse profile = profileService.getOwnProfile(authHeader);
        return ResponseEntity.ok(ProfileDtos.ApiResponse.ok(profile));
    }

    /**
     * PUT /api/v1/profiles/me
     * Обновляет профиль аутентифицированного пользователя.
     * Требует: Authorization: Bearer <token>
     */
    @PutMapping("/me")
    public ResponseEntity<ProfileDtos.ApiResponse<ProfileDtos.OwnProfileResponse>> updateOwnProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ProfileDtos.UpdateProfileRequest request) {
        ProfileDtos.OwnProfileResponse updated = profileService.updateOwnProfile(authHeader, request);
        return ResponseEntity.ok(ProfileDtos.ApiResponse.ok(updated));
    }

    /**
     * GET /api/v1/profiles/{userId}
     * Возвращает публичный профиль пользователя (без email и phone).
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDtos.ApiResponse<ProfileDtos.PublicProfileResponse>> getPublicProfile(
            @PathVariable Long userId) {
        ProfileDtos.PublicProfileResponse profile = profileService.getPublicProfile(userId);
        return ResponseEntity.ok(ProfileDtos.ApiResponse.ok(profile));
    }

    /**
     * GET /api/v1/profiles
     * Возвращает список всех публичных профилей.
     */
    @GetMapping
    public ResponseEntity<ProfileDtos.ApiResponse<java.util.List<ProfileDtos.PublicProfileResponse>>> getAllPublicProfiles() {
        java.util.List<ProfileDtos.PublicProfileResponse> profiles = profileService.getAllPublicProfiles();
        return ResponseEntity.ok(ProfileDtos.ApiResponse.ok(profiles));
    }

    // ──────────────── Обработка ошибок ────────────────

    @ExceptionHandler(ProfileException.InvalidToken.class)
    public ResponseEntity<ProfileDtos.ApiResponse<ProfileDtos.ErrorData>> handleInvalidToken(
            ProfileException.InvalidToken ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ProfileDtos.ApiResponse.error(new ProfileDtos.ErrorData(ex.getMessage())));
    }

    @ExceptionHandler(ProfileException.UserNotFound.class)
    public ResponseEntity<ProfileDtos.ApiResponse<ProfileDtos.ErrorData>> handleUserNotFound(
            ProfileException.UserNotFound ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ProfileDtos.ApiResponse.error(new ProfileDtos.ErrorData(ex.getMessage())));
    }

    @ExceptionHandler(ProfileException.UserBlocked.class)
    public ResponseEntity<ProfileDtos.ApiResponse<ProfileDtos.ErrorData>> handleUserBlocked(
            ProfileException.UserBlocked ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ProfileDtos.ApiResponse.error(new ProfileDtos.ErrorData(ex.getMessage())));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProfileDtos.ApiResponse<ProfileDtos.ErrorData>> handleValidation(
            MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ProfileDtos.ApiResponse.error(new ProfileDtos.ErrorData(message)));
    }

    /** Отсутствующий заголовок Authorization → 401 */
    @ExceptionHandler(org.springframework.web.bind.MissingRequestHeaderException.class)
    public ResponseEntity<ProfileDtos.ApiResponse<ProfileDtos.ErrorData>> handleMissingHeader(
            org.springframework.web.bind.MissingRequestHeaderException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ProfileDtos.ApiResponse.error(
                        new ProfileDtos.ErrorData("Отсутствует или невалидный JWT токен")));
    }
}
