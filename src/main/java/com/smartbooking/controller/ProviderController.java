package com.smartbooking.controller;

import com.smartbooking.dto.ProviderResponseDto;
import com.smartbooking.service.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;

@RestController
@RequestMapping("/api/providers")
@Tag(name = "Providers", description = "Provider listing and availability management")
public class ProviderController {
    private final ProviderService providerService;

    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    @GetMapping
    @Operation(summary = "List providers")
    public ResponseEntity<List<ProviderResponseDto>> listProviders() {
        return ResponseEntity.ok(providerService.listProviders());
    }

    @PatchMapping("/{id}/availability")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update provider availability", description = "Requires ROLE_PROVIDER or ROLE_ADMIN")
    public ResponseEntity<ProviderResponseDto> updateAvailability(@PathVariable @NonNull Long id, @RequestParam boolean available) {
        return ResponseEntity.ok(providerService.updateAvailability(id, available));
    }

    @PostMapping("/{id}/avatar")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Upload provider avatar", description = "Uploads provider image to configured storage backend")
    public ResponseEntity<ProviderResponseDto> uploadAvatar(@PathVariable @NonNull Long id, @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(providerService.uploadAvatar(id, file));
    }
}
