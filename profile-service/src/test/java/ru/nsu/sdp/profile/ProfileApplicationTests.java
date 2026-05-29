package ru.nsu.sdp.profile;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:tc:postgresql:15:///database",
        "spring.jpa.hibernate.ddl-auto=none"
})
class ProfileApplicationTests {

    @Test
    void contextLoads() {
    }
}
