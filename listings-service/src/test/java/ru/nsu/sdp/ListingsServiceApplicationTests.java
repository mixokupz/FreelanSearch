package ru.nsu.sdp;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ru.nsu.sdp.listings.repository.ListingRepository;
import ru.nsu.sdp.listings.service.JwtService;

import java.math.BigDecimal;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ListingsServiceApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ListingRepository listingRepository;

    @BeforeEach
    void setUp() {
        listingRepository.deleteAll();
    }

    @Test
    void contextLoads() {
    }

    @Test
    void shouldReturnUnauthorizedWithoutJwt() throws Exception {
        String payload = objectMapper.writeValueAsString(Map.of(
                "title", "Тестовое объявление",
                "description", "Описание объявления",
                "price", BigDecimal.valueOf(1200),
                "priceType", "fixed"
        ));

        mockMvc.perform(post("/api/v1/listings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void shouldCreateReadUpdateDeleteListing() throws Exception {
        String token = jwtService.generateToken(10L);
        String bearer = "Bearer " + token;

        String createPayload = objectMapper.writeValueAsString(Map.of(
                "title", "Разработка лендинга",
                "description", "Сделаю адаптивный лендинг",
                "price", BigDecimal.valueOf(5000),
                "priceType", "fixed"
        ));

        String createResponse = mockMvc.perform(post("/api/v1/listings")
                        .header("Authorization", bearer)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode created = objectMapper.readTree(createResponse);
        long id = created.at("/data/id").asLong();

        mockMvc.perform(get("/api/v1/listings/{id}", id)
                        .header("Authorization", bearer))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Разработка лендинга"));

        String updatePayload = objectMapper.writeValueAsString(Map.of(
                "title", "Разработка лендинга под ключ",
                "description", "Сделаю дизайн и верстку",
                "price", BigDecimal.valueOf(7000),
                "priceType", "fixed",
                "status", "active"
        ));

        mockMvc.perform(put("/api/v1/listings/{id}", id)
                        .header("Authorization", bearer)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("active"));

        mockMvc.perform(delete("/api/v1/listings/{id}", id)
                        .header("Authorization", bearer))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/v1/listings/{id}", id)
                        .header("Authorization", bearer))
                .andExpect(status().isNotFound());
    }
}
