package ru.nsu.sdp.profile.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Все эндпоинты открыты на уровне Spring Security —
                        // аутентификация выполняется вручную в сервисном слое
                        // через валидацию JWT-заголовка.
                        .requestMatchers("/api/v1/profiles/**").permitAll()
                        .anyRequest().denyAll()
                );
        return http.build();
    }
}
