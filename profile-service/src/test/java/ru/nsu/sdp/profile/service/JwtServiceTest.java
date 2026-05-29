package ru.nsu.sdp.profile.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.nsu.sdp.profile.exception.ProfileException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String SECRET =
            "ThisIsASecretKeyForFreelanSearchPlatformMustBe256BitsLong!";

    private JwtService jwtService;
    private SecretKey  secretKey;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET);
        secretKey = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void extractUserId_validToken_returnsCorrectId() {
        String token = buildToken(42L, nowPlusMs(60_000));

        Long userId = jwtService.extractUserId(token);

        assertThat(userId).isEqualTo(42L);
    }

    @Test
    void extractUserId_expiredToken_throwsInvalidToken() {
        String token = buildToken(1L, nowPlusMs(-1_000)); // уже истёк

        assertThatThrownBy(() -> jwtService.extractUserId(token))
                .isInstanceOf(ProfileException.InvalidToken.class);
    }

    @Test
    void extractUserId_garbledToken_throwsInvalidToken() {
        assertThatThrownBy(() -> jwtService.extractUserId("not.a.jwt.at.all"))
                .isInstanceOf(ProfileException.InvalidToken.class);
    }

    @Test
    void extractUserId_emptyToken_throwsInvalidToken() {
        assertThatThrownBy(() -> jwtService.extractUserId(""))
                .isInstanceOf(ProfileException.InvalidToken.class);
    }

    @Test
    void extractUserId_tokenSignedWithWrongSecret_throwsInvalidToken() {
        SecretKey wrongKey = Keys.hmacShaKeyFor(
                "AnotherWrongSecretKeyLongEnoughForHMACAlgorithm!".getBytes(StandardCharsets.UTF_8));
        String token = Jwts.builder()
                .subject("1")
                .expiration(new Date(nowPlusMs(60_000)))
                .signWith(wrongKey)
                .compact();

        assertThatThrownBy(() -> jwtService.extractUserId(token))
                .isInstanceOf(ProfileException.InvalidToken.class);
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    private String buildToken(Long userId, long expirationEpochMs) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .expiration(new Date(expirationEpochMs))
                .signWith(secretKey)
                .compact();
    }

    private long nowPlusMs(long delta) {
        return System.currentTimeMillis() + delta;
    }
}
