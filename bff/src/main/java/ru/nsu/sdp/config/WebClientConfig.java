package ru.nsu.sdp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import org.springframework.context.annotation.Primary;

@Configuration
public class WebClientConfig {

    @Value("${services.auth.url:http://auth-service:8081}")
    private String authServiceUrl;

    @Value("${services.profile.url:http://profile-service:8082}")
    private String profileServiceUrl;

    @Value("${services.listings.url:http://listings-service:8083}")
    private String listingsServiceUrl;

    @Bean("authWebClient")
    @Primary
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl(authServiceUrl)
                .build();
    }

    @Bean("profileWebClient")
    public WebClient profileWebClient() {
        return WebClient.builder()
                .baseUrl(profileServiceUrl)
                .build();
    }

    @Bean("listingsWebClient")
    public WebClient listingsWebClient() {
        return WebClient.builder()
                .baseUrl(listingsServiceUrl)
                .build();
    }
}
