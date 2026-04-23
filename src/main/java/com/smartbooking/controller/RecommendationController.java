package com.smartbooking.controller;

import com.smartbooking.dto.RecommendationDto;
import com.smartbooking.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
@Tag(name = "Recommendation", description = "AI-style personalized service recommendations")
@SecurityRequirement(name = "bearerAuth")
public class RecommendationController {
    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get recommendations for current user", description = "Uses booking history to infer preferred category, then ranks services by ratings and popularity.")
    public ResponseEntity<RecommendationDto> getRecommendations(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(recommendationService.recommendServicesForUser(userId));
    }
}
