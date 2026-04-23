package com.smartbooking.dto;

import com.smartbooking.model.BookingStatus;
import java.time.LocalDateTime;

public record BookingEventDto(
    Long bookingId,
    Long userId,
    Long serviceId,
    String serviceTitle,
    BookingStatus status,
    LocalDateTime scheduledAt,
    LocalDateTime createdAt
) {
}
