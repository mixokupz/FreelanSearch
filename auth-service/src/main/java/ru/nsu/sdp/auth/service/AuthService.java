package ru.nsu.sdp.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.nsu.sdp.auth.dto.AuthDtos;
import ru.nsu.sdp.auth.entity.Profile;
import ru.nsu.sdp.auth.entity.User;
import ru.nsu.sdp.auth.exception.AuthException;
import ru.nsu.sdp.auth.repository.ProfileRepository;
import ru.nsu.sdp.auth.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * Вход пользователя по email и паролю.
     * Проверяет, что пользователь существует, не заблокирован,
     * и что хэш пароля совпадает с переданным.
     */
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException.InvalidCredentials());

        if (user.isBlocked()) {
            throw new AuthException.UserBlocked();
        }

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthException.InvalidCredentials();
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return AuthDtos.AuthResponse.ok(String.valueOf(user.getId()), token);
    }

    /**
     * Регистрация нового пользователя.
     * Создаёт запись в таблицах users и profiles.
     * При успехе сразу возвращает JWT-токен.
     */
    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException.EmailAlreadyExists();
        }

        // Создаём пользователя
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setAuthProvider("local");
        user.setRole("user");
        user = userRepository.save(user);

        // Создаём профиль
        Profile profile = new Profile();
        profile.setUserId(user.getId());
        profile.setDisplayName(request.getName());
        profileRepository.save(profile);

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return AuthDtos.AuthResponse.ok(String.valueOf(user.getId()), token);
    }
}
