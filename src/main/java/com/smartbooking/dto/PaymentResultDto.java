package com.smartbooking.dto;

import com.smartbooking.model.PaymentStatus;

public class PaymentResultDto {
    private final PaymentStatus status;
    private final String transactionId;
    private final String message;

    public PaymentResultDto(PaymentStatus status, String transactionId, String message) {
        this.status = status;
        this.transactionId = transactionId;
        this.message = message;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public String getMessage() {
        return message;
    }
}
