package ru.nsu.sdp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import ru.nsu.sdp.dto.ApiResponse;
import ru.nsu.sdp.dto.UserProfile;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private static final ParameterizedTypeReference<ApiResponse<UserProfile>> PROFILE_RESPONSE_TYPE =
            new ParameterizedTypeReference<>() {};

    private final WebClient webClient;

    public ApiResponse<UserProfile> getCurrentUserProfile(String authorizationHeader) {
        return fetchProfile("/api/v1/users/me", authorizationHeader);
    }

    public ApiResponse<UserProfile> getUserProfileById(Integer userId, String authorizationHeader) {
        return fetchProfile("/api/v1/users/{id}", authorizationHeader, userId);
    }

    private ApiResponse<UserProfile> fetchProfile(String uri, String authorizationHeader, Object... uriVariables) {
        WebClient.RequestHeadersSpec<?> request = webClient.get()
                .uri(uri, uriVariables);

        if (authorizationHeader != null && !authorizationHeader.isBlank()) {
            request = request.header("Authorization", authorizationHeader);
        }

        ApiResponse<UserProfile> profileResponse = request
                .retrieve()
                .bodyToMono(PROFILE_RESPONSE_TYPE)
                .block();

        return Objects.requireNonNull(profileResponse, "Profile service returned empty response body");
    }
}
