package com.smartbooking.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "service_id"}))
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @Column(nullable = false)
    private int rating;

    @Column(length = 1024)
    private String review;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Rating() {
    }

    public Rating(User user, ServiceEntity service, int rating, String review) {
        this.user = user;
        this.service = service;
        this.rating = rating;
        this.review = review;
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

    public int getRating() {
        return rating;
    }

    public String getReview() {
        return review;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
