package com.smartbooking.dto;

import java.util.List;

public class ChatResponseDto {
    private final String intent;
    private final String response;
    private final List<ServiceResponseDto> services;

    public ChatResponseDto(String intent, String response, List<ServiceResponseDto> services) {
        this.intent = intent;
        this.response = response;
        this.services = services;
    }

    public String getIntent() {
        return intent;
    }

    public String getResponse() {
        return response;
    }

    public List<ServiceResponseDto> getServices() {
        return services;
    }
}
