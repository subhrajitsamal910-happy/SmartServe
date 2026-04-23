package com.smartbooking.dto;

import java.time.LocalDateTime;

public class RatingResponseDto {
    private Long id;
    private Long userId;
    private Long serviceId;
    private int rating;
    private String review;
    private LocalDateTime createdAt;

    public RatingResponseDto(Long id, Long userId, Long serviceId, int rating, String review, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.serviceId = serviceId;
        this.rating = rating;
        this.review = review;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public int getRating() {
        return rating;
    }

    public String getReview() {
        return review;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
