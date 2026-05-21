package ru.nsu.sdp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import ru.nsu.sdp.service.ProfileService;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final ProfileService profileService;

    /**
     * GET /api/v1/users/me
     * Возвращает полный профиль текущего пользователя.
     * Требует: Authorization: Bearer <token>
     */
    @GetMapping(value = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<String>> getOwnProfile(
            @RequestHeader("Authorization") String authHeader) {
        return profileService.getOwnProfile(authHeader);
    }

    /**
     * PUT /api/v1/users/me
     * Обновляет профиль текущего пользователя (display_name, avatar_url, bio, city).
     * Требует: Authorization: Bearer <token>
     */
    @PutMapping(value = "/me",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<String>> updateOwnProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody String body) {
        return profileService.updateOwnProfile(authHeader, body);
    }

    /**
     * GET /api/v1/users/{userId}
     * Возвращает публичный профиль пользователя (без email и phone).
     */
    @GetMapping(value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<String>> getPublicProfile(@PathVariable Long userId) {
        return profileService.getPublicProfile(userId);
    }
}
