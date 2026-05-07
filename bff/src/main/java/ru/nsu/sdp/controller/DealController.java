package ru.nsu.sdp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.nsu.sdp.dto.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/deals")
public class DealController {

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ListResponse<Deal>>> getDeals(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {

        List<Deal> mockDeals = getMockDeals();

        if (role != null && !role.isEmpty()) {
            mockDeals = mockDeals.stream()
                    .filter(deal -> {
                        if ("customer".equals(role)) {
                            return deal.getClient().getId() == 1;
                        } else if ("freelancer".equals(role)) {
                            return deal.getExecutor().getId() == 1;
                        }
                        return true;
                    })
                    .collect(Collectors.toList());
        }

        if (status != null && !status.isEmpty()) {
            mockDeals = mockDeals.stream()
                    .filter(deal -> status.equals(deal.getStatus()))
                    .collect(Collectors.toList());
        }

        ListResponse<Deal> data = new ListResponse<>(mockDeals);
        ApiResponse<ListResponse<Deal>> response = new ApiResponse<>("success", data);
        return ResponseEntity.ok(response);
    }

    private List<Deal> getMockDeals() {
        List<Deal> deals = new ArrayList<>();

        Deal deal1 = new Deal();
        deal1.setId(1);

        Deal.DealUser client = new Deal.DealUser();
        client.setId(1);
        client.setDisplayName("John Doe");
        client.setAvatarUrl("https://example.com/avatar1.jpg");
        deal1.setClient(client);

        Deal.DealUser executor = new Deal.DealUser();
        executor.setId(2);
        executor.setDisplayName("Jane Smith");
        executor.setAvatarUrl("https://example.com/avatar2.jpg");
        deal1.setExecutor(executor);

        Deal.DealService service = new Deal.DealService();
        service.setId(1);
        service.setTitle("Web Development");
        deal1.setService(service);

        deal1.setStatus("in_progress");
        deal1.setCreatedAt(LocalDateTime.now().minusDays(5));
        deal1.setCompletedAt(null);

        deals.add(deal1);

        Deal deal2 = new Deal();
        deal2.setId(2);

        Deal.DealUser client2 = new Deal.DealUser();
        client2.setId(1);
        client2.setDisplayName("John Doe");
        client2.setAvatarUrl("https://example.com/avatar1.jpg");
        deal2.setClient(client2);

        Deal.DealUser executor2 = new Deal.DealUser();
        executor2.setId(3);
        executor2.setDisplayName("Bob Johnson");
        executor2.setAvatarUrl("https://example.com/avatar3.jpg");
        deal2.setExecutor(executor2);

        Deal.DealService service2 = new Deal.DealService();
        service2.setId(2);
        service2.setTitle("Mobile App Development");
        deal2.setService(service2);

        deal2.setStatus("completed");
        deal2.setCreatedAt(LocalDateTime.now().minusDays(30));
        deal2.setCompletedAt(LocalDateTime.now().minusDays(2));

        deals.add(deal2);

        return deals;
    }
}
