package com.smartbooking.dto;

public class ProviderResponseDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private boolean available;
    private String avatarUrl;

    public ProviderResponseDto(Long id, String name, String email, String phone, boolean available, String avatarUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.available = available;
        this.avatarUrl = avatarUrl;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public boolean isAvailable() {
        return available;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }
}
