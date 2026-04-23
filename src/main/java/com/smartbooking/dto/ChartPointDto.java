package com.smartbooking.dto;

public class ChartPointDto {
    private final String label;
    private final long value;

    public ChartPointDto(String label, long value) {
        this.label = label;
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public long getValue() {
        return value;
    }
}
