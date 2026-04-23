package com.smartbooking.dto;

import com.smartbooking.model.UserRole;

public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
    private UserRole role;

    public UserResponseDto(Long id, String name, String email, UserRole role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
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

    public UserRole getRole() {
        return role;
    }
}
