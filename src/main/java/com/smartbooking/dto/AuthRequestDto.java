package com.smartbooking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthRequestDto {
    @Email
    @NotBlank
    @Schema(example = "user@smartserve.ai")
    private String email;

    @NotBlank
    @Schema(example = "password123")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
