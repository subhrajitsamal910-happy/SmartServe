package com.smartbooking.dto;

import com.smartbooking.model.ServiceCategory;

public class ServiceResponseDto {
    private Long id;
    private String title;
    private String description;
    private ServiceCategory category;
    private String providerName;
    private double price;
    private String imageUrl;
    private boolean providerAvailable;
    private double averageRating;
    private long ratingCount;
    private long bookingCount;

    public ServiceResponseDto(Long id, String title, String description, ServiceCategory category, String providerName, double price, String imageUrl, boolean providerAvailable, double averageRating, long ratingCount, long bookingCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.providerName = providerName;
        this.price = price;
        this.imageUrl = imageUrl;
        this.providerAvailable = providerAvailable;
        this.averageRating = averageRating;
        this.ratingCount = ratingCount;
        this.bookingCount = bookingCount;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public ServiceCategory getCategory() {
        return category;
    }

    public String getProviderName() {
        return providerName;
    }

    public double getPrice() {
        return price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public boolean isProviderAvailable() {
        return providerAvailable;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public long getRatingCount() {
        return ratingCount;
    }

    public long getBookingCount() {
        return bookingCount;
    }
}
