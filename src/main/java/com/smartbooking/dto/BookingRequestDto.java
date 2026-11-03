package com.smartbooking.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * Request body for creating a booking.
 *
 * scheduledAt accepts both ISO-8601 with timezone (e.g. "2026-11-03T10:00:00.000Z")
 * and without (e.g. "2026-11-03T10:00:00"). The @Future constraint is intentionally
 * removed here; the service layer returns a user-friendly conflict message instead.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookingRequestDto {

    @NotNull(message = "serviceId is required")
    @Schema(example = "1", description = "Service id to book. User id comes from JWT.")
    private Long serviceId;

    /**
     * Accept as String so Jackson doesn't choke on the trailing 'Z' that browsers
     * add via Date.toISOString(). Converted to LocalDateTime via getScheduledAtAsLocalDateTime().
     */
    @NotNull(message = "scheduledAt is required")
    @Schema(example = "2026-11-05T10:00:00", description = "Requested start time (ISO-8601)")
    private String scheduledAt;

    @Min(value = 30, message = "Duration must be at least 30 minutes")
    @Max(value = 240, message = "Duration may not exceed 240 minutes")
    @Schema(example = "60", description = "Expected duration in minutes (30-240)")
    private int durationMinutes = 60;

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public String getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }

    /**
     * Parses scheduledAt handling 'Z', offset, or plain local datetime strings.
     */
    public LocalDateTime getScheduledAtAsLocalDateTime() {
        if (scheduledAt == null || scheduledAt.isBlank()) return null;
        String s = scheduledAt.trim();
        try {
            if (s.endsWith("Z")) {
                return Instant.parse(s).atZone(ZoneOffset.UTC).toLocalDateTime();
            }
            if (s.contains("+") || (s.length() > 19 && s.charAt(19) == '-')) {
                return Instant.parse(s).atZone(ZoneOffset.UTC).toLocalDateTime();
            }
            return LocalDateTime.parse(s);
        } catch (Exception e) {
            String trimmed = s.replaceAll("\\.[0-9]+Z?$", "");
            return LocalDateTime.parse(trimmed);
        }
    }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
}
