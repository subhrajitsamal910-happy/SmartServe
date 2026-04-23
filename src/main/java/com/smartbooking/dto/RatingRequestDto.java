package com.smartbooking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RatingRequestDto {
    @NotNull
    @Schema(example = "1")
    private Long serviceId;

    @Min(1)
    @Max(5)
    @Schema(example = "5")
    private int rating;

    @Size(max = 1024)
    @Schema(example = "Fast, professional, and affordable.")
    private String review;

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }
}
