package ru.nsu.sdp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class MediaService {

    @Qualifier("mediaWebClient")
    private final WebClient mediaWebClient;

    public ResponseEntity<byte[]> downloadImage(String mediaId, String authorizationHeader) {
        WebClient.RequestHeadersSpec<?> request = mediaWebClient.get()
                .uri("/api/v1/media/{mediaId}", mediaId);

        if (authorizationHeader != null && !authorizationHeader.isBlank()) {
            request = request.header(HttpHeaders.AUTHORIZATION, authorizationHeader);
        }

        ResponseEntity<byte[]> mediaResponse = request
                .retrieve()
                .toEntity(byte[].class)
                .block();

        ResponseEntity<byte[]> response = Objects.requireNonNull(mediaResponse, "Media service returned empty response");
        byte[] body = Objects.requireNonNull(response.getBody(), "Media service returned empty image body");

        HttpHeaders headers = new HttpHeaders();
        if (response.getHeaders().getContentType() != null) {
            headers.setContentType(response.getHeaders().getContentType());
        }
        if (response.getHeaders().getContentLength() >= 0) {
            headers.setContentLength(response.getHeaders().getContentLength());
        }
        String contentDisposition = response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION);
        if (contentDisposition != null) {
            headers.set(HttpHeaders.CONTENT_DISPOSITION, contentDisposition);
        }
        String cacheControl = response.getHeaders().getCacheControl();
        if (cacheControl != null && !cacheControl.isBlank()) {
            headers.setCacheControl(cacheControl);
        }

        return new ResponseEntity<>(body, headers, response.getStatusCode());
    }
}
