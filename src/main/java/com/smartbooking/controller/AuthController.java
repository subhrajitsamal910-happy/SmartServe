package com.smartbooking.controller;

import com.smartbooking.dto.AuthRequestDto;
import com.smartbooking.dto.AuthResponseDto;
import com.smartbooking.dto.RefreshTokenRequestDto;
import com.smartbooking.dto.RegisterRequestDto;
import com.smartbooking.dto.UserResponseDto;
import com.smartbooking.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Registration and JWT login APIs")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(
        summary = "Register a user",
        description = "Creates a USER account. Admin account is seeded by the demo data loader.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = "{\"name\":\"Aarav Sharma\",\"email\":\"aarav@example.com\",\"password\":\"password123\"}"))),
        responses = {
            @ApiResponse(responseCode = "201", description = "User registered"),
            @ApiResponse(responseCode = "409", description = "Email already exists")
        }
    )
    public ResponseEntity<UserResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(
        summary = "Login and receive JWT",
        description = "Use demo credentials user@smartserve.ai/password123 or admin@smartserve.ai/admin123.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = "{\"email\":\"user@smartserve.ai\",\"password\":\"password123\"}"))),
        responses = {
            @ApiResponse(responseCode = "200", description = "JWT issued"),
            @ApiResponse(responseCode = "400", description = "Invalid credentials")
        }
    )
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody AuthRequestDto request) {
        return ResponseEntity.ok(authService.login(request.getEmail(), request.getPassword()));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Rotates refresh token and returns new access/refresh pair.")
    public ResponseEntity<AuthResponseDto> refresh(@Valid @RequestBody RefreshTokenRequestDto request) {
        return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Revokes active refresh tokens for the current user.")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal Long userId) {
        authService.logout(userId);
        return ResponseEntity.noContent().build();
    }
}
