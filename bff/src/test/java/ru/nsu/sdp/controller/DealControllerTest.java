package ru.nsu.sdp.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ru.nsu.sdp.dto.ApiResponse;
import ru.nsu.sdp.dto.Deal;
import ru.nsu.sdp.dto.ListResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class DealControllerTest {

    @Test
    void getDealsFiltersByStatus() {
        DealController controller = new DealController();

        ResponseEntity<ApiResponse<ListResponse<Deal>>> entity = controller.getDeals(null, "completed");

        assertEquals(HttpStatus.OK, entity.getStatusCode());
        assertNotNull(entity.getBody());
        assertEquals("success", entity.getBody().getStatus());
        assertNotNull(entity.getBody().getData());
        assertEquals(1, entity.getBody().getData().getItems().size());
        assertEquals("completed", entity.getBody().getData().getItems().get(0).getStatus());
    }

    @Test
    void getDealsFiltersByRoleFreelancer() {
        DealController controller = new DealController();

        ResponseEntity<ApiResponse<ListResponse<Deal>>> entity = controller.getDeals("freelancer", null);

        assertEquals(HttpStatus.OK, entity.getStatusCode());
        assertNotNull(entity.getBody());
        assertNotNull(entity.getBody().getData());
        assertEquals(0, entity.getBody().getData().getItems().size());
    }
}
