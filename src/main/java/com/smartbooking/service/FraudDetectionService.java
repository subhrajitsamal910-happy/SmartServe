package com.smartbooking.service;

import com.smartbooking.dto.FraudAssessmentDto;
import com.smartbooking.entity.Booking;
import com.smartbooking.entity.ServiceEntity;
import com.smartbooking.model.BookingStatus;
import com.smartbooking.model.PaymentStatus;
import com.smartbooking.repository.BookingRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public class FraudDetectionService {
    private final int flagThreshold;

    private final BookingRepository bookingRepository;

    public FraudDetectionService(BookingRepository bookingRepository, int flagThreshold) {
        this.bookingRepository = bookingRepository;
        this.flagThreshold = flagThreshold;
    }

    public FraudAssessmentDto assess(Long userId, ServiceEntity service) {
        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        LocalDateTime now = LocalDateTime.now();
        int risk = 5;
        List<String> signals = new ArrayList<>();
        List<Booking> recentBookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(safeUserId);

        long perMinute = bookingRepository.countByUserIdAndCreatedAtAfter(safeUserId, now.minusMinutes(1));
        if (perMinute >= 3) {
            risk += 40;
            signals.add("Burst booking velocity within one minute");
        } else if (perMinute >= 2) {
            risk += 28;
            signals.add("More than two bookings in one minute");
        }

        long perHour = bookingRepository.countByUserIdAndCreatedAtAfter(safeUserId, now.minusHours(1));
        if (perHour >= 6) {
            risk += 30;
            signals.add("High booking velocity in the last hour");
        } else if (perHour >= 4) {
            risk += 22;
            signals.add("Sustained elevated booking velocity in the last hour");
        } else if (perHour >= 3) {
            risk += 18;
            signals.add("Elevated booking velocity in the last hour");
        }

        long repeatedService = bookingRepository.countByUserIdAndServiceIdAndCreatedAtAfter(safeUserId, service.getId(), now.minusMinutes(15));
        if (repeatedService >= 3) {
            risk += 32;
            signals.add("Same service repeatedly booked in 15 minutes");
        } else if (repeatedService >= 2) {
            risk += 24;
            signals.add("Same service repeatedly booked in a short window");
        }

        long lastDay = bookingRepository.countByUserIdAndCreatedAtAfter(safeUserId, now.minusHours(24));
        if (lastDay >= 12) {
            risk += 15;
            signals.add("Unusual 24-hour booking volume");
        } else if (lastDay >= 8) {
            risk += 8;
            signals.add("Moderately high 24-hour booking activity");
        }

        long sameCategoryToday = recentBookings.stream()
            .filter(booking -> booking.getCreatedAt().isAfter(now.minusHours(24)))
            .filter(booking -> booking.getService().getCategory() == service.getCategory())
            .count();
        if (sameCategoryToday >= 4) {
            risk += 10;
            signals.add("Repeated category pattern detected");
        }

        Set<Object> distinctCategoriesLastHour = new HashSet<>();
        recentBookings.stream()
            .filter(booking -> booking.getCreatedAt().isAfter(now.minusHours(1)))
            .forEach(booking -> distinctCategoriesLastHour.add(booking.getService().getCategory()));
        if (distinctCategoriesLastHour.size() >= 4) {
            risk += 12;
            signals.add("Suspicious category switching pattern detected");
        }

        long failedPaymentsToday = recentBookings.stream()
            .filter(booking -> booking.getCreatedAt().isAfter(now.minusHours(24)))
            .filter(booking -> booking.getPaymentStatus() == PaymentStatus.FAILED)
            .count();
        if (failedPaymentsToday >= 2) {
            risk += 12;
            signals.add("Multiple failed payments in the last 24 hours");
        }

        long flaggedHistory = recentBookings.stream()
            .filter(booking -> booking.getStatus() == BookingStatus.FLAGGED)
            .count();
        if (flaggedHistory > 0) {
            risk += 10;
            signals.add("Previous flagged booking history");
        }

        if (now.getHour() >= 1 && now.getHour() <= 5 && perHour >= 3) {
            risk += 8;
            signals.add("High-risk booking burst during night hours");
        }

        risk = Math.min(100, risk);
        BookingStatus status = risk >= flagThreshold ? BookingStatus.FLAGGED : BookingStatus.CONFIRMED;
        String message = status == BookingStatus.FLAGGED ? "High fraud risk detected" : "Booking risk looks normal";
        return new FraudAssessmentDto(status, risk, message, signals);
    }
}
