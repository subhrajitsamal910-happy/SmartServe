package com.smartbooking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

public class BookingRequestDto {
    @NotNull
    @Schema(example = "1", description = "Service id to book. User id comes from JWT.")
    private Long serviceId;

    @NotNull
    @Future
    @Schema(example = "2026-04-21T10:00:00", description = "Requested start time for service")
    private LocalDateTime scheduledAt;

    @Min(30)
    @Max(240)
    @Schema(example = "60", description = "Expected duration in minutes")
    private int durationMinutes = 60;

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}
