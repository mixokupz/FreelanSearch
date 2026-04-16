package ru.nsu.sdp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AuthResponse {
    private Boolean success;
    private AuthData data;

    @Data
    public static class AuthData {
        private String userId;
        private String status;
        private String token;
    }

    public static AuthResponse of(String userId, String token) {
        AuthResponse response = new AuthResponse();
        response.setSuccess(true);
        
        AuthData data = new AuthData();
        data.setUserId(userId);
        data.setStatus("success");
        data.setToken(token);
        response.setData(data);
        
        return response;
    }
}
