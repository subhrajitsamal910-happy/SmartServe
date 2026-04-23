package com.smartbooking.entity;

import com.smartbooking.model.BookingStatus;
import com.smartbooking.model.PaymentStatus;
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
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(nullable = false)
    private int riskScore;

    @Column(length = 512)
    private String fraudMessage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.SUCCESS;

    @Column(length = 64)
    private String paymentTransactionId;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime scheduledAt = LocalDateTime.now().plusHours(2);

    @Column(nullable = false)
    private int durationMinutes = 60;

    public Booking() {
    }

    public Booking(User user, ServiceEntity service, BookingStatus status) {
        this(user, service, status, 0, "Low fraud risk", PaymentStatus.SUCCESS, null);
    }

    public Booking(User user, ServiceEntity service, BookingStatus status, int riskScore, String fraudMessage, PaymentStatus paymentStatus, String paymentTransactionId) {
        this(user, service, status, riskScore, fraudMessage, paymentStatus, paymentTransactionId, LocalDateTime.now().plusHours(2), 60);
    }

    public Booking(User user, ServiceEntity service, BookingStatus status, int riskScore, String fraudMessage, PaymentStatus paymentStatus, String paymentTransactionId, LocalDateTime scheduledAt, int durationMinutes) {
        this.user = user;
        this.service = service;
        this.status = status;
        this.riskScore = riskScore;
        this.fraudMessage = fraudMessage;
        this.paymentStatus = paymentStatus;
        this.paymentTransactionId = paymentTransactionId;
        this.createdAt = LocalDateTime.now();
        this.scheduledAt = scheduledAt;
        this.durationMinutes = durationMinutes;
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

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public String getFraudMessage() {
        return fraudMessage;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public String getPaymentTransactionId() {
        return paymentTransactionId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }
}
