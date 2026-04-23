package com.smartbooking.dto;

import com.smartbooking.model.BookingStatus;
import com.smartbooking.model.PaymentStatus;
import java.time.LocalDateTime;
import java.util.List;

public class BookingResponseDto {
    private Long bookingId;
    private Long userId;
    private Long serviceId;
    private String serviceTitle;
    private BookingStatus status;
    private int riskScore;
    private String fraudMessage;
    private List<String> fraudSignals;
    private PaymentStatus paymentStatus;
    private String paymentTransactionId;
    private LocalDateTime scheduledAt;
    private int durationMinutes;
    private LocalDateTime suggestedRescheduleAt;
    private LocalDateTime createdAt;

    public BookingResponseDto(Long bookingId, Long userId, Long serviceId, String serviceTitle, BookingStatus status, int riskScore, String fraudMessage, List<String> fraudSignals, PaymentStatus paymentStatus, String paymentTransactionId, LocalDateTime scheduledAt, int durationMinutes, LocalDateTime suggestedRescheduleAt, LocalDateTime createdAt) {
        this.bookingId = bookingId;
        this.userId = userId;
        this.serviceId = serviceId;
        this.serviceTitle = serviceTitle;
        this.status = status;
        this.riskScore = riskScore;
        this.fraudMessage = fraudMessage;
        this.fraudSignals = fraudSignals;
        this.paymentStatus = paymentStatus;
        this.paymentTransactionId = paymentTransactionId;
        this.scheduledAt = scheduledAt;
        this.durationMinutes = durationMinutes;
        this.suggestedRescheduleAt = suggestedRescheduleAt;
        this.createdAt = createdAt;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getServiceId() {
        return serviceId;
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

    public String getFraudMessage() {
        return fraudMessage;
    }

    public List<String> getFraudSignals() {
        return fraudSignals;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public String getPaymentTransactionId() {
        return paymentTransactionId;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public LocalDateTime getSuggestedRescheduleAt() {
        return suggestedRescheduleAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
