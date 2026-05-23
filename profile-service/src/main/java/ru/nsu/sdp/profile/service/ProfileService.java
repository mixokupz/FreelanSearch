package ru.nsu.sdp.profile.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.nsu.sdp.profile.dto.ProfileDtos;
import ru.nsu.sdp.profile.entity.Profile;
import ru.nsu.sdp.profile.entity.User;
import ru.nsu.sdp.profile.exception.ProfileException;
import ru.nsu.sdp.profile.repository.ProfileRepository;
import ru.nsu.sdp.profile.repository.UserRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final JwtService jwtService;

    /**
     * Получение собственного профиля по JWT токену из заголовка Authorization.
     *
     * @param authHeader значение заголовка Authorization ("Bearer <token>")
     * @return OwnProfileResponse — объединённые поля users + profiles
     */
    public ProfileDtos.OwnProfileResponse getOwnProfile(String authHeader) {
        Long userId = extractUserIdFromHeader(authHeader);
        User user = findActiveUser(userId);
        Profile profile = findProfileByUserId(userId);
        return mapToOwnProfileResponse(user, profile);
    }

    /**
     * Получение публичного профиля другого пользователя по его userId.
     *
     * @param userId ID запрошенного пользователя
     * @return PublicProfileResponse — без email и phone
     */
    public ProfileDtos.PublicProfileResponse getPublicProfile(Long userId) {
        User user = findActiveUser(userId);
        Profile profile = findProfileByUserId(userId);
        return mapToPublicProfileResponse(user, profile);
    }

    /**
     * Обновление собственного профиля.
     * Обновляются только поля display_name, avatar_url, bio, city.
     * Таблица users НЕ изменяется.
     *
     * @param authHeader заголовок Authorization
     * @param request    тело запроса с изменяемыми полями
     * @return OwnProfileResponse с обновлёнными данными
     */
    @Transactional
    public ProfileDtos.OwnProfileResponse updateOwnProfile(
            String authHeader,
            ProfileDtos.UpdateProfileRequest request) {

        Long userId = extractUserIdFromHeader(authHeader);
        User user = findActiveUser(userId);
        Profile profile = findProfileByUserId(userId);

        applyUpdates(profile, request);
        profile.setUpdatedAt(LocalDateTime.now());
        profileRepository.save(profile);

        return mapToOwnProfileResponse(user, profile);
    }

    // ──────────────── вспомогательные методы ────────────────

    private Long extractUserIdFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ProfileException.InvalidToken();
        }
        String token = authHeader.substring(7);
        return jwtService.extractUserId(token);
    }

    /**
     * Возвращает пользователя, если он существует и не заблокирован.
     */
    private User findActiveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(ProfileException.UserNotFound::new);
        if (user.isBlocked()) {
            throw new ProfileException.UserBlocked();
        }
        return user;
    }

    /**
     * Возвращает профиль пользователя.
     * Если профиля нет — бросаем UserNotFound, т.к. профиль должен
     * создаваться одновременно с пользователем (см. AuthService.register).
     */
    private Profile findProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(ProfileException.UserNotFound::new);
    }

    private void applyUpdates(Profile profile, ProfileDtos.UpdateProfileRequest request) {
        if (request.getDisplayName() != null) {
            profile.setDisplayName(request.getDisplayName());
        }
        if (request.getAvatarUrl() != null) {
            profile.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getCity() != null) {
            profile.setCity(request.getCity());
        }
    }

    private ProfileDtos.OwnProfileResponse mapToOwnProfileResponse(User user, Profile profile) {
        return ProfileDtos.OwnProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .isBlocked(user.isBlocked())
                .createdAt(user.getCreatedAt())
                .displayName(profile.getDisplayName())
                .avatarUrl(profile.getAvatarUrl())
                .bio(profile.getBio())
                .city(profile.getCity())
                .avgRating(profile.getAvgRating())
                .reviewsCount(profile.getReviewsCount())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    private ProfileDtos.PublicProfileResponse mapToPublicProfileResponse(User user, Profile profile) {
        return ProfileDtos.PublicProfileResponse.builder()
                .id(user.getId())
                .role(user.getRole())
                .displayName(profile.getDisplayName())
                .avatarUrl(profile.getAvatarUrl())
                .bio(profile.getBio())
                .city(profile.getCity())
                .avgRating(profile.getAvgRating())
                .reviewsCount(profile.getReviewsCount())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
