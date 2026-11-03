package com.smartbooking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RecommendationDto {
    private Long userId;

    /** Exposed as both "logic" and "logicSummary" for frontend compatibility. */
    @JsonProperty("logicSummary")
    private String logic;

    private List<ServiceResponseDto> recommendedServices;

    public RecommendationDto(Long userId, String logic, List<ServiceResponseDto> recommendedServices) {
        this.userId = userId;
        this.logic = logic;
        this.recommendedServices = recommendedServices;
    }

    public Long getUserId() { return userId; }

    @JsonProperty("logicSummary")
    public String getLogic() { return logic; }

    public List<ServiceResponseDto> getRecommendedServices() { return recommendedServices; }
}
