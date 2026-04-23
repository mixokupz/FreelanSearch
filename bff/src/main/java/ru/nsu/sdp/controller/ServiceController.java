package ru.nsu.sdp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import ru.nsu.sdp.dto.*;
import ru.nsu.sdp.service.ServiceCatalogService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceCatalogService serviceCatalogService;

    @GetMapping
    public ResponseEntity<ApiResponse<ListResponse<ServiceAdView>>> getServiceAnnouncements(
            @RequestParam MultiValueMap<String, String> queryParams,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        ApiResponse<ListResponse<ServiceAdView>> response =
                serviceCatalogService.getAnnouncements(authorizationHeader, queryParams);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ListResponse<UserService>>> getCurrentUserServices() {
        List<UserService> services = new ArrayList<>();

        UserService service1 = new UserService();
        service1.setId(1);
        service1.setTitle("Web Development");
        service1.setDescription("Professional web development services");
        service1.setPrice(5000.0);
        service1.setPriceType("fixed");
        service1.setStatus("active");

        UserService.ServiceCategory category = new UserService.ServiceCategory();
        category.setId(1);
        category.setName("Web Development");
        category.setSlug("web-development");
        service1.setCategory(category);

        UserService.ServicePhoto photo = new UserService.ServicePhoto();
        photo.setId(1);
        photo.setUrl("https://example.com/photo.jpg");
        photo.setSortOrder(1);
        service1.setPhotos(List.of(photo));

        UserService.ServiceTag tag = new UserService.ServiceTag();
        tag.setId(1);
        tag.setName("React");
        tag.setSlug("react");
        service1.setTags(List.of(tag));

        service1.setCreatedAt(LocalDateTime.now().minusDays(10));
        service1.setUpdatedAt(LocalDateTime.now());

        services.add(service1);

        ListResponse<UserService> data = new ListResponse<>(services);
        ApiResponse<ListResponse<UserService>> response = new ApiResponse<>("success", data);
        return ResponseEntity.ok(response);
    }
}
