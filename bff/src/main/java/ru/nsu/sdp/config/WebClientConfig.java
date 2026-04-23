package ru.nsu.sdp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

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
    public WebClient serviceWebClient(@Value("${services.service.base-url:https://api.yourfreelance.com}") String serviceServiceBaseUrl) {
        return WebClient.builder()
                .baseUrl(serviceServiceBaseUrl)
                .build();
    }
}
