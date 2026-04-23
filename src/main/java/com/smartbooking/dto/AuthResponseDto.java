package com.smartbooking.dto;

import com.smartbooking.model.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;

public class AuthResponseDto {
    @Schema(example = "Bearer")
    private String tokenType = "Bearer";

    private String token;
    private String refreshToken;
    private Long userId;
    private String name;
    private String email;
    private UserRole role;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String token, String refreshToken, Long userId, String name, String email, UserRole role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getTokenType() {
        return tokenType;
    }

    public String getToken() {
        return token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public UserRole getRole() {
        return role;
    }
}
