package com.smartbooking.dto;

import java.time.Instant;
import java.util.Map;

public class StatusResponseDto {
    private String application;
    private String status;
    private Instant timestamp;
    private Map<String, Object> metrics;

    public StatusResponseDto(String application, String status, Instant timestamp, Map<String, Object> metrics) {
        this.application = application;
        this.status = status;
        this.timestamp = timestamp;
        this.metrics = metrics;
    }

    public String getApplication() {
        return application;
    }

    public String getStatus() {
        return status;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public Map<String, Object> getMetrics() {
        return metrics;
    }
}
