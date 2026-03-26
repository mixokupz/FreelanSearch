package ru.nsu.sdp.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String userId;
}
