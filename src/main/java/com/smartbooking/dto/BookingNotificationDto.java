package com.smartbooking.dto;

import com.smartbooking.model.BookingStatus;
import java.time.LocalDateTime;

public class BookingNotificationDto {
    private final Long bookingId;
    private final String serviceTitle;
    private final BookingStatus status;
    private final int riskScore;
    private final LocalDateTime createdAt;

    public BookingNotificationDto(Long bookingId, String serviceTitle, BookingStatus status, int riskScore, LocalDateTime createdAt) {
        this.bookingId = bookingId;
        this.serviceTitle = serviceTitle;
        this.status = status;
        this.riskScore = riskScore;
        this.createdAt = createdAt;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public String getServiceTitle() {
        return serviceTitle;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
