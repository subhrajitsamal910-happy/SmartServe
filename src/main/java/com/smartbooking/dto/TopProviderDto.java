package com.smartbooking.dto;

public class TopProviderDto {
    private String providerName;
    private long bookingCount;

    public TopProviderDto(String providerName, long bookingCount) {
        this.providerName = providerName;
        this.bookingCount = bookingCount;
    }

    public String getProviderName() {
        return providerName;
    }

    public long getBookingCount() {
        return bookingCount;
    }
}
