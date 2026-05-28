package ru.nsu.sdp.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private static final String SECRET =
            "ThisIsASecretKeyForFreelanSearchPlatformMustBe256BitsLong!";
    private static final long EXPIRATION_MS = 86_400_000L;

    private JwtService jwtService;
    private SecretKey secretKey;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET, EXPIRATION_MS);
        secretKey = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void generateToken_returnsNonBlankString() {
        String token = jwtService.generateToken(1L, "user@test.com", "user");
        assertThat(token).isNotBlank();
    }

    @Test
    void generateToken_subjectEqualsUserId() {
        String token = jwtService.generateToken(42L, "user@test.com", "user");
        Claims claims = parse(token);
        assertThat(claims.getSubject()).isEqualTo("42");
    }

    @Test
    void generateToken_containsEmailClaim() {
        String token = jwtService.generateToken(1L, "user@test.com", "user");
        Claims claims = parse(token);
        assertThat(claims.get("email", String.class)).isEqualTo("user@test.com");
    }

    @Test
    void generateToken_containsRoleClaim() {
        String token = jwtService.generateToken(1L, "user@test.com", "admin");
        Claims claims = parse(token);
        assertThat(claims.get("role", String.class)).isEqualTo("admin");
    }

    @Test
    void generateToken_expirationIsInFuture() {
        long before = System.currentTimeMillis();
        String token = jwtService.generateToken(1L, "user@test.com", "user");
        Claims claims = parse(token);
        assertThat(claims.getExpiration().getTime())
                .isGreaterThan(before + EXPIRATION_MS / 2); // хотя бы половина срока жизни
    }

    @Test
    void generateToken_differentUsersProduceDifferentTokens() {
        String t1 = jwtService.generateToken(1L, "a@test.com", "user");
        String t2 = jwtService.generateToken(2L, "b@test.com", "user");
        assertThat(t1).isNotEqualTo(t2);
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    private Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
