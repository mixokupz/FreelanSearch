package ru.nsu.sdp.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.nsu.sdp.auth.dto.AuthDtos;
import ru.nsu.sdp.auth.entity.Profile;
import ru.nsu.sdp.auth.entity.User;
import ru.nsu.sdp.auth.exception.AuthException;
import ru.nsu.sdp.auth.repository.ProfileRepository;
import ru.nsu.sdp.auth.repository.UserRepository;

@Slf4j  // Добавляем логгер
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
        log.info("AUTH_SERVICE: login request - email={}, password={}", 
                 request.getEmail(), request.getPassword());
        
        long startTime = System.currentTimeMillis();
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("AUTH_SERVICE: login failed - user not found: {}", request.getEmail());
                    return new AuthException.InvalidCredentials();
                });

        if (user.isBlocked()) {
            log.warn("AUTH_SERVICE: login failed - user blocked: {}", request.getEmail());
            throw new AuthException.UserBlocked();
        }

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("AUTH_SERVICE: login failed - invalid password for: {}", request.getEmail());
            throw new AuthException.InvalidCredentials();
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        long duration = System.currentTimeMillis() - startTime;
        
        log.info("AUTH_SERVICE: login success - email={}, userId={}, token={}, duration={}ms", 
                 request.getEmail(), user.getId(), token, duration);
        
        return AuthDtos.AuthResponse.ok(String.valueOf(user.getId()), token);
    }

    /**
     * Регистрация нового пользователя.
     * Создаёт запись в таблицах users и profiles.
     * При успехе сразу возвращает JWT-токен.
     */
    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        log.info("AUTH_SERVICE: register request - email={}, name={}, password={}", 
                 request.getEmail(), request.getName(), request.getPassword());
        
        long startTime = System.currentTimeMillis();
        
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("AUTH_SERVICE: register failed - email already exists: {}", request.getEmail());
            throw new AuthException.EmailAlreadyExists();
        }

        // Создаём пользователя
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setAuthProvider("local");
        user.setRole("user");
        user = userRepository.save(user);
        log.debug("AUTH_SERVICE: user created - id={}, email={}", user.getId(), user.getEmail());

        // Создаём профиль
        Profile profile = new Profile();
        profile.setUserId(user.getId());
        profile.setDisplayName(request.getName());
        profileRepository.save(profile);
        log.debug("AUTH_SERVICE: profile created - userId={}, displayName={}", user.getId(), request.getName());

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        long duration = System.currentTimeMillis() - startTime;
        
        log.info("AUTH_SERVICE: register success - email={}, userId={}, token={}, duration={}ms", 
                 request.getEmail(), user.getId(), token, duration);
        
        return AuthDtos.AuthResponse.ok(String.valueOf(user.getId()), token);
    }
}
