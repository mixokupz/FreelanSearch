package ru.nsu.sdp.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import ru.nsu.sdp.dto.AuthRequest;
import ru.nsu.sdp.dto.AuthResponse;
import ru.nsu.sdp.dto.RegisterRequest;
import ru.nsu.sdp.service.AuthService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class AuthControllerTest {

    private static class StubAuthService extends AuthService {
        private final Mono<AuthResponse> loginResult;
        private final Mono<AuthResponse> registerResult;

        StubAuthService(Mono<AuthResponse> loginResult, Mono<AuthResponse> registerResult) {
            super(WebClient.builder().baseUrl("http://localhost").build());
            this.loginResult = loginResult;
            this.registerResult = registerResult;
        }

        @Override
        public Mono<AuthResponse> login(AuthRequest request) {
            return loginResult;
        }

        @Override
        public Mono<AuthResponse> register(RegisterRequest request) {
            return registerResult;
        }
    }

    @Test
    void loginReturnsOkOnSuccess() {
        AuthResponse response = AuthResponse.of("1", "token");
        AuthController controller = new AuthController(new StubAuthService(Mono.just(response), Mono.just(response)));

        ResponseEntity<AuthResponse> entity = controller.login(new AuthRequest()).block();

        assertNotNull(entity);
        assertEquals(HttpStatus.OK, entity.getStatusCode());
        assertEquals("1", entity.getBody().getData().getUserId());
    }

    @Test
    void loginReturnsUnauthorizedOnError() {
        AuthController controller = new AuthController(
                new StubAuthService(Mono.error(new RuntimeException("boom")), Mono.just(AuthResponse.of("1", "t")))
        );

        ResponseEntity<AuthResponse> entity = controller.login(new AuthRequest()).block();

        assertNotNull(entity);
        assertEquals(HttpStatus.UNAUTHORIZED, entity.getStatusCode());
        assertNotNull(entity.getBody());
        assertNotNull(entity.getBody().getData());
        assertNull(entity.getBody().getData().getUserId());
        assertNull(entity.getBody().getData().getToken());
    }

    @Test
    void registerReturnsConflictWhenEmailExists() {
        AuthController controller = new AuthController(
                new StubAuthService(Mono.just(AuthResponse.of("1", "t")), Mono.error(new RuntimeException("email уже существует")))
        );

        ResponseEntity<AuthResponse> entity = controller.register(new RegisterRequest()).block();

        assertNotNull(entity);
        assertEquals(HttpStatus.CONFLICT, entity.getStatusCode());
    }

    @Test
    void registerReturnsCreatedOnSuccess() {
        AuthResponse response = AuthResponse.of("7", "token");
        AuthController controller = new AuthController(new StubAuthService(Mono.just(response), Mono.just(response)));

        ResponseEntity<AuthResponse> entity = controller.register(new RegisterRequest()).block();

        assertNotNull(entity);
        assertEquals(HttpStatus.CREATED, entity.getStatusCode());
    }
}
