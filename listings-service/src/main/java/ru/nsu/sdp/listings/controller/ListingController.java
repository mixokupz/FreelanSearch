package ru.nsu.sdp.listings.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import ru.nsu.sdp.listings.dto.ListingDtos;
import ru.nsu.sdp.listings.exception.ListingException;
import ru.nsu.sdp.listings.service.JwtService;
import ru.nsu.sdp.listings.service.ListingService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<ListingDtos.ApiResponse<ListingDtos.ListingData>> create(
            @Valid @RequestBody ListingDtos.CreateListingRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = jwtService.extractUserIdFromHeader(authHeader);
        ListingDtos.ListingData data = listingService.create(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ListingDtos.ApiResponse.ok(data));
    }

    @GetMapping
    public ResponseEntity<ListingDtos.ApiResponse<List<ListingDtos.ListingData>>> getAll() {
        List<ListingDtos.ListingData> data = listingService.getAll();
        return ResponseEntity.ok(ListingDtos.ApiResponse.ok(data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingDtos.ApiResponse<ListingDtos.ListingData>> getById(
            @PathVariable Long id
    ) {
        ListingDtos.ListingData data = listingService.getById(id);
        return ResponseEntity.ok(ListingDtos.ApiResponse.ok(data));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ListingDtos.ApiResponse<List<ListingDtos.ListingData>>> getByUserId(
            @PathVariable Long userId
    ) {
        List<ListingDtos.ListingData> data = listingService.getByUserId(userId);
        return ResponseEntity.ok(ListingDtos.ApiResponse.ok(data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingDtos.ApiResponse<ListingDtos.ListingData>> update(
            @PathVariable Long id,
            @Valid @RequestBody ListingDtos.UpdateListingRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = jwtService.extractUserIdFromHeader(authHeader);
        ListingDtos.ListingData data = listingService.update(id, request, userId);
        return ResponseEntity.ok(ListingDtos.ApiResponse.ok(data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ListingDtos.ApiResponse<ListingDtos.MessageData>> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = jwtService.extractUserIdFromHeader(authHeader);
        listingService.delete(id, userId);
        return ResponseEntity.ok(ListingDtos.ApiResponse.ok(new ListingDtos.MessageData("Объявление удалено")));
    }

    @ExceptionHandler(ListingException.NotFound.class)
    public ResponseEntity<ListingDtos.ApiResponse<ListingDtos.ErrorData>> handleNotFound(ListingException.NotFound ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ListingDtos.ApiResponse.error(new ListingDtos.ErrorData(ex.getMessage())));
    }

    @ExceptionHandler(ListingException.Forbidden.class)
    public ResponseEntity<ListingDtos.ApiResponse<ListingDtos.ErrorData>> handleForbidden(ListingException.Forbidden ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ListingDtos.ApiResponse.error(new ListingDtos.ErrorData(ex.getMessage())));
    }

    @ExceptionHandler(ListingException.Unauthorized.class)
    public ResponseEntity<ListingDtos.ApiResponse<ListingDtos.ErrorData>> handleUnauthorized(ListingException.Unauthorized ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ListingDtos.ApiResponse.error(new ListingDtos.ErrorData(ex.getMessage())));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ListingDtos.ApiResponse<ListingDtos.ErrorData>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ListingDtos.ApiResponse.error(new ListingDtos.ErrorData(message)));
    }

    /** Отсутствующий заголовок Authorization → 401 */
    @ExceptionHandler(org.springframework.web.bind.MissingRequestHeaderException.class)
    public ResponseEntity<ListingDtos.ApiResponse<ListingDtos.ErrorData>> handleMissingHeader(
            org.springframework.web.bind.MissingRequestHeaderException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ListingDtos.ApiResponse.error(
                        new ListingDtos.ErrorData("Отсутствует или невалидный JWT токен")));
    }
}
