package ru.nsu.sdp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${services.auth.url:http://auth-service:8081}")
    private String authServiceUrl;

    @Bean
    @Primary
    public WebClient webClient(@Value("${services.profile.base-url:https://api.yourfreelance.com}") String profileServiceBaseUrl) {
        return WebClient.builder()
                .baseUrl(profileServiceBaseUrl)
                .build();
    }

    @Bean
    public WebClient mediaWebClient(@Value("${services.media.base-url:https://api.yourfreelance.com}") String mediaServiceBaseUrl) {
        return WebClient.builder()
                .baseUrl(mediaServiceBaseUrl)
                .build();
    }

    @Bean
    public WebClient searchWebClient(@Value("${services.search.base-url:https://api.yourfreelance.com}") String searchServiceBaseUrl) {
        return WebClient.builder()
                .baseUrl(searchServiceBaseUrl)
                .build();
    }
}
