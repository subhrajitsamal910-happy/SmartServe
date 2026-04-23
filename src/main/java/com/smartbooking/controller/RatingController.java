package com.smartbooking.controller;

import com.smartbooking.dto.RatingRequestDto;
import com.smartbooking.dto.RatingResponseDto;
import com.smartbooking.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Ratings", description = "Ratings and reviews for local services")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping("/ratings")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Rate a service",
        description = "Adds one rating for the authenticated user.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = "{\"serviceId\":1,\"rating\":5,\"review\":\"Excellent service\"}")))
    )
    public ResponseEntity<RatingResponseDto> addRating(@AuthenticationPrincipal Long userId, @Valid @RequestBody RatingRequestDto request) {
        return ResponseEntity.ok(ratingService.addRating(userId, request));
    }

    @GetMapping("/services/{id}/ratings")
    @Operation(summary = "List service ratings", description = "Public endpoint to view service reviews.")
    public ResponseEntity<List<RatingResponseDto>> getRatings(@PathVariable Long id) {
        return ResponseEntity.ok(ratingService.getRatingsByServiceId(id));
    }
}
