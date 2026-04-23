package com.smartbooking.dto;

import java.util.List;

public class RecommendationDto {
    private Long userId;
    private String logic;
    private List<ServiceResponseDto> recommendedServices;

    public RecommendationDto(Long userId, String logic, List<ServiceResponseDto> recommendedServices) {
        this.userId = userId;
        this.logic = logic;
        this.recommendedServices = recommendedServices;
    }

    public Long getUserId() {
        return userId;
    }

    public String getLogic() {
        return logic;
    }

    public List<ServiceResponseDto> getRecommendedServices() {
        return recommendedServices;
    }
}
