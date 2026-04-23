package com.smartbooking.entity;

import com.smartbooking.model.BehaviorAction;
import com.smartbooking.model.ServiceCategory;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_behavior_history")
public class UserBehaviorHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private ServiceEntity service;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BehaviorAction action;

    @Column(length = 512)
    private String metadata;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public UserBehaviorHistory() {
    }

    public UserBehaviorHistory(User user, ServiceEntity service, ServiceCategory category, BehaviorAction action, String metadata) {
        this.user = user;
        this.service = service;
        this.category = category;
        this.action = action;
        this.metadata = metadata;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public ServiceEntity getService() {
        return service;
    }

    public ServiceCategory getCategory() {
        return category;
    }

    public BehaviorAction getAction() {
        return action;
    }

    public String getMetadata() {
        return metadata;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
