package com.smartbooking.dto;

import java.util.List;

public class ChatResponseDto {
    private final String intent;
    private final String response;
    private final List<ServiceResponseDto> services;
    private final List<String> suggestions;

    public ChatResponseDto(String intent, String response, List<ServiceResponseDto> services) {
        this(intent, response, services, List.of());
    }

    public ChatResponseDto(String intent, String response, List<ServiceResponseDto> services, List<String> suggestions) {
        this.intent = intent;
        this.response = response;
        this.services = services != null ? services : List.of();
        this.suggestions = suggestions != null ? suggestions : List.of();
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

    public List<String> getSuggestions() {
        return suggestions;
    }
}
