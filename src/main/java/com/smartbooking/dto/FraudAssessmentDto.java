package com.smartbooking.dto;

import com.smartbooking.model.BookingStatus;
import java.util.List;

public class FraudAssessmentDto {
    private final BookingStatus status;
    private final int riskScore;
    private final String message;
    private final List<String> signals;

    public FraudAssessmentDto(BookingStatus status, int riskScore, String message, List<String> signals) {
        this.status = status;
        this.riskScore = riskScore;
        this.message = message;
        this.signals = signals;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getSignals() {
        return signals;
    }
}
