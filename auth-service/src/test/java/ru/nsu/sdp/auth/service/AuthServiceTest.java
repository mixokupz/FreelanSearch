package ru.nsu.sdp.auth.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import ru.nsu.sdp.auth.dto.AuthDtos;
import ru.nsu.sdp.auth.entity.Profile;
import ru.nsu.sdp.auth.entity.User;
import ru.nsu.sdp.auth.exception.AuthException;
import ru.nsu.sdp.auth.repository.ProfileRepository;
import ru.nsu.sdp.auth.repository.UserRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository    userRepository;
    @Mock private ProfileRepository profileRepository;
    @Mock private JwtService        jwtService;
    @Mock private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User activeUser;

    @BeforeEach
    void setUp() {
        activeUser = new User();
        activeUser.setId(1L);
        activeUser.setEmail("user@test.com");
        activeUser.setPasswordHash("$2a$10$hashedPassword");
        activeUser.setRole("user");
        activeUser.setBlocked(false);
    }

    // ─── login ─────────────────────────────────────────────────────────────────

    @Test
    void login_validCredentials_returnsSuccessResponse() {
        AuthDtos.LoginRequest req = loginRequest("user@test.com", "correctPassword");

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("correctPassword", activeUser.getPasswordHash()))
                .thenReturn(true);
        when(jwtService.generateToken(1L, "user@test.com", "user")).thenReturn("jwt-token");

        AuthDtos.AuthResponse response = authService.login(req);

        assertThat(response.isSuccess()).isTrue();
        verify(jwtService).generateToken(1L, "user@test.com", "user");
    }

    @Test
    void login_unknownEmail_throwsInvalidCredentials() {
        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(loginRequest("ghost@test.com", "pass")))
                .isInstanceOf(AuthException.InvalidCredentials.class);
    }

    @Test
    void login_wrongPassword_throwsInvalidCredentials() {
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("wrong", activeUser.getPasswordHash())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(loginRequest("user@test.com", "wrong")))
                .isInstanceOf(AuthException.InvalidCredentials.class);

        verify(jwtService, never()).generateToken(any(), any(), any());
    }

    @Test
    void login_nullPasswordHash_throwsInvalidCredentials() {
        activeUser.setPasswordHash(null);
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(activeUser));

        assertThatThrownBy(() -> authService.login(loginRequest("user@test.com", "pass")))
                .isInstanceOf(AuthException.InvalidCredentials.class);
    }

    @Test
    void login_blockedUser_throwsUserBlocked() {
        activeUser.setBlocked(true);
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(activeUser));

        assertThatThrownBy(() -> authService.login(loginRequest("user@test.com", "pass")))
                .isInstanceOf(AuthException.UserBlocked.class);

        // Пароль даже не проверяется
        verify(passwordEncoder, never()).matches(any(), any());
    }

    // ─── register ──────────────────────────────────────────────────────────────

    @Test
    void register_newUser_createsUserAndProfileAndReturnsToken() {
        AuthDtos.RegisterRequest req = registerRequest("new@test.com", "password123", "New User");

        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$encodedHash");

        User savedUser = new User();
        savedUser.setId(2L);
        savedUser.setEmail("new@test.com");
        savedUser.setRole("user");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(profileRepository.save(any(Profile.class))).thenReturn(new Profile());
        when(jwtService.generateToken(2L, "new@test.com", "user")).thenReturn("new-jwt-token");

        AuthDtos.AuthResponse response = authService.register(req);

        assertThat(response.isSuccess()).isTrue();
        verify(userRepository).save(any(User.class));
        verify(profileRepository).save(any(Profile.class));
        verify(jwtService).generateToken(2L, "new@test.com", "user");
    }

    @Test
    void register_profileDisplayNameEqualsRequestName() {
        AuthDtos.RegisterRequest req = registerRequest("u@test.com", "password123", "Alice");

        when(userRepository.existsByEmail("u@test.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("$hash");

        User savedUser = new User();
        savedUser.setId(3L);
        savedUser.setEmail("u@test.com");
        savedUser.setRole("user");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(any(), any(), any())).thenReturn("tok");

        authService.register(req);

        verify(profileRepository).save(argThat(p -> "Alice".equals(p.getDisplayName())));
    }

    @Test
    void register_emailAlreadyExists_throwsEmailAlreadyExists() {
        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        assertThatThrownBy(() ->
                authService.register(registerRequest("existing@test.com", "pass123", "User")))
                .isInstanceOf(AuthException.EmailAlreadyExists.class);

        verify(userRepository, never()).save(any());
        verify(profileRepository, never()).save(any());
    }

    @Test
    void register_passwordIsStoredAsHash() {
        AuthDtos.RegisterRequest req = registerRequest("u@test.com", "rawPassword", "User");

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode("rawPassword")).thenReturn("$bcryptHash");

        User savedUser = new User();
        savedUser.setId(5L);
        savedUser.setEmail("u@test.com");
        savedUser.setRole("user");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(any(), any(), any())).thenReturn("tok");

        authService.register(req);

        // Пароль должен быть закодирован перед сохранением
        verify(userRepository).save(argThat(u -> "$bcryptHash".equals(u.getPasswordHash())));
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    private AuthDtos.LoginRequest loginRequest(String email, String password) {
        AuthDtos.LoginRequest r = new AuthDtos.LoginRequest();
        r.setEmail(email);
        r.setPassword(password);
        return r;
    }

    private AuthDtos.RegisterRequest registerRequest(String email, String password, String name) {
        AuthDtos.RegisterRequest r = new AuthDtos.RegisterRequest();
        r.setEmail(email);
        r.setPassword(password);
        r.setName(name);
        return r;
    }
}
