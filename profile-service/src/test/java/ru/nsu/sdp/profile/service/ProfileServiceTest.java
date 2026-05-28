package ru.nsu.sdp.profile.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.nsu.sdp.profile.dto.ProfileDtos;
import ru.nsu.sdp.profile.entity.Profile;
import ru.nsu.sdp.profile.entity.User;
import ru.nsu.sdp.profile.exception.ProfileException;
import ru.nsu.sdp.profile.repository.ProfileRepository;
import ru.nsu.sdp.profile.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock private UserRepository    userRepository;
    @Mock private ProfileRepository profileRepository;
    @Mock private JwtService        jwtService;

    @InjectMocks
    private ProfileService profileService;

    private User    activeUser;
    private Profile profile;

    @BeforeEach
    void setUp() {
        activeUser = new User();
        activeUser.setId(1L);
        activeUser.setEmail("user@test.com");
        activeUser.setPhone("+79001234567");
        activeUser.setRole("user");
        activeUser.setBlocked(false);
        activeUser.setCreatedAt(LocalDateTime.now());
        activeUser.setUpdatedAt(LocalDateTime.now());

        profile = new Profile();
        profile.setId(1L);
        profile.setUserId(1L);
        profile.setDisplayName("Test User");
        profile.setAvatarUrl("https://example.com/avatar.png");
        profile.setBio("Some bio text");
        profile.setCity("Moscow");
        profile.setAvgRating(4.5);
        profile.setReviewsCount(10);
        profile.setUpdatedAt(LocalDateTime.now());
    }

    // ─── getOwnProfile ─────────────────────────────────────────────────────────

    @Test
    void getOwnProfile_validHeader_returnsFullProfileData() {
        when(jwtService.extractUserId("valid-token")).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));

        ProfileDtos.OwnProfileResponse response =
                profileService.getOwnProfile("Bearer valid-token");

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("user@test.com");
        assertThat(response.getDisplayName()).isEqualTo("Test User");
        assertThat(response.getCity()).isEqualTo("Moscow");
    }

    @Test
    void getOwnProfile_headerWithoutBearerPrefix_throwsInvalidToken() {
        assertThatThrownBy(() -> profileService.getOwnProfile("just-a-token"))
                .isInstanceOf(ProfileException.InvalidToken.class);

        verifyNoInteractions(jwtService, userRepository, profileRepository);
    }

    @Test
    void getOwnProfile_nullHeader_throwsInvalidToken() {
        assertThatThrownBy(() -> profileService.getOwnProfile(null))
                .isInstanceOf(ProfileException.InvalidToken.class);

        verifyNoInteractions(jwtService, userRepository, profileRepository);
    }

    @Test
    void getOwnProfile_userNotFound_throwsUserNotFound() {
        when(jwtService.extractUserId("valid-token")).thenReturn(99L);
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> profileService.getOwnProfile("Bearer valid-token"))
                .isInstanceOf(ProfileException.UserNotFound.class);
    }

    @Test
    void getOwnProfile_blockedUser_throwsUserBlocked() {
        activeUser.setBlocked(true);
        when(jwtService.extractUserId("valid-token")).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));

        assertThatThrownBy(() -> profileService.getOwnProfile("Bearer valid-token"))
                .isInstanceOf(ProfileException.UserBlocked.class);

        verifyNoInteractions(profileRepository);
    }

    // ─── getPublicProfile ──────────────────────────────────────────────────────

    @Test
    void getPublicProfile_existingActiveUser_returnsPublicData() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));

        ProfileDtos.PublicProfileResponse response = profileService.getPublicProfile(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getDisplayName()).isEqualTo("Test User");
        assertThat(response.getAvgRating()).isEqualTo(4.5);
    }

    @Test
    void getPublicProfile_userNotFound_throwsUserNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> profileService.getPublicProfile(999L))
                .isInstanceOf(ProfileException.UserNotFound.class);
    }

    @Test
    void getPublicProfile_blockedUser_throwsUserBlocked() {
        activeUser.setBlocked(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));

        assertThatThrownBy(() -> profileService.getPublicProfile(1L))
                .isInstanceOf(ProfileException.UserBlocked.class);
    }

    // ─── getAllPublicProfiles ───────────────────────────────────────────────────

    @Test
    void getAllPublicProfiles_returnsOnlyActiveUsersWithProfiles() {
        User blockedUser = blockedUserWithId(2L);
        User userWithoutProfile = activeUserWithId(3L);

        when(userRepository.findAll())
                .thenReturn(List.of(activeUser, blockedUser, userWithoutProfile));
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(profileRepository.findByUserId(3L)).thenReturn(Optional.empty());

        List<ProfileDtos.PublicProfileResponse> result = profileService.getAllPublicProfiles();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
    }

    @Test
    void getAllPublicProfiles_emptyRepository_returnsEmptyList() {
        when(userRepository.findAll()).thenReturn(List.of());

        List<ProfileDtos.PublicProfileResponse> result = profileService.getAllPublicProfiles();

        assertThat(result).isEmpty();
    }

    @Test
    void getAllPublicProfiles_allUsersBlocked_returnsEmptyList() {
        when(userRepository.findAll()).thenReturn(List.of(blockedUserWithId(1L), blockedUserWithId(2L)));

        List<ProfileDtos.PublicProfileResponse> result = profileService.getAllPublicProfiles();

        assertThat(result).isEmpty();
        verifyNoInteractions(profileRepository);
    }

    // ─── updateOwnProfile ──────────────────────────────────────────────────────

    @Test
    void updateOwnProfile_validRequest_updatesAndReturnsNewValues() {
        when(jwtService.extractUserId("valid-token")).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(profileRepository.save(any(Profile.class))).thenAnswer(inv -> inv.getArgument(0));

        ProfileDtos.UpdateProfileRequest req = new ProfileDtos.UpdateProfileRequest();
        req.setDisplayName("Updated Name");
        req.setCity("Saint Petersburg");

        ProfileDtos.OwnProfileResponse response =
                profileService.updateOwnProfile("Bearer valid-token", req);

        assertThat(response.getDisplayName()).isEqualTo("Updated Name");
        assertThat(response.getCity()).isEqualTo("Saint Petersburg");
        verify(profileRepository).save(any(Profile.class));
    }

    @Test
    void updateOwnProfile_nullFields_doesNotOverwriteExistingValues() {
        when(jwtService.extractUserId("valid-token")).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(profileRepository.save(any(Profile.class))).thenAnswer(inv -> inv.getArgument(0));

        // Все поля в запросе — null, ничего не должно измениться
        ProfileDtos.UpdateProfileRequest req = new ProfileDtos.UpdateProfileRequest();

        ProfileDtos.OwnProfileResponse response =
                profileService.updateOwnProfile("Bearer valid-token", req);

        assertThat(response.getDisplayName()).isEqualTo("Test User");
        assertThat(response.getCity()).isEqualTo("Moscow");
        assertThat(response.getBio()).isEqualTo("Some bio text");
    }

    @Test
    void updateOwnProfile_blockedUser_throwsUserBlockedAndNeverSaves() {
        activeUser.setBlocked(true);
        when(jwtService.extractUserId("valid-token")).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));

        ProfileDtos.UpdateProfileRequest req = new ProfileDtos.UpdateProfileRequest();
        req.setDisplayName("Hacker");

        assertThatThrownBy(() -> profileService.updateOwnProfile("Bearer valid-token", req))
                .isInstanceOf(ProfileException.UserBlocked.class);

        verify(profileRepository, never()).save(any());
    }

    @Test
    void updateOwnProfile_userNotFound_throwsUserNotFound() {
        when(jwtService.extractUserId("valid-token")).thenReturn(99L);
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                profileService.updateOwnProfile("Bearer valid-token", new ProfileDtos.UpdateProfileRequest()))
                .isInstanceOf(ProfileException.UserNotFound.class);
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    private User activeUserWithId(Long id) {
        User u = new User();
        u.setId(id);
        u.setRole("user");
        u.setBlocked(false);
        u.setCreatedAt(LocalDateTime.now());
        u.setUpdatedAt(LocalDateTime.now());
        return u;
    }

    private User blockedUserWithId(Long id) {
        User u = activeUserWithId(id);
        u.setBlocked(true);
        return u;
    }
}
