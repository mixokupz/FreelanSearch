package ru.nsu.sdp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(@Value("${services.profile.base-url:https://api.yourfreelance.com}") String profileServiceBaseUrl) {
        return WebClient.builder()
                .baseUrl(profileServiceBaseUrl)
                .build();
    }
}
