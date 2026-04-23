package com.smartbooking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequestDto {
    @NotBlank
    @Schema(example = "Aarav Sharma")
    private String name;

    @Email
    @NotBlank
    @Schema(example = "aarav@example.com")
    private String email;

    @NotBlank
    @Size(min = 6)
    @Schema(example = "password123")
    private String password;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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
