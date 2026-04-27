import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                              // На все эндпоинты
                .allowedOrigins("http://localhost:5173")        // URL твоего фронтенда (Vite)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Разрешаем OPTIONS для preflight
                .allowedHeaders("*")                            // Разрешаем все заголовки
                .allowCredentials(true)                         // Разрешаем куки/JWT
                .maxAge(3600);                                  // Кэшируем preflight на 1 час
    }
}