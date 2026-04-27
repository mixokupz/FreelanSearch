package ru.nsu.sdp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.nsu.sdp.service.MediaService;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @GetMapping("/{mediaId}")
    public ResponseEntity<byte[]> downloadImage(
            @PathVariable String mediaId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        return mediaService.downloadImage(mediaId, authorizationHeader);
    }
}
