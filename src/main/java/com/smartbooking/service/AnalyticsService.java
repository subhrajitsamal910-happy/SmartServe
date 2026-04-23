package com.smartbooking.service;

import com.smartbooking.dto.AnalyticsDto;
import com.smartbooking.dto.ChartPointDto;
import com.smartbooking.dto.TopProviderDto;
import com.smartbooking.entity.Booking;
import com.smartbooking.model.BookingStatus;
import com.smartbooking.repository.BookingRepository;
import com.smartbooking.repository.ServiceRepository;
import com.smartbooking.repository.UserRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnalyticsService {
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;

    public AnalyticsService(UserRepository userRepository, BookingRepository bookingRepository, ServiceRepository serviceRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsDto getAdminAnalytics() {
        String mostBookedService = bookingRepository.findMostBookedServiceTitle(PageRequest.of(0, 1))
            .stream()
            .findFirst()
            .orElse("N/A");

        List<TopProviderDto> topProviders = bookingRepository.findTopProviders(PageRequest.of(0, 5)).stream()
            .map(row -> new TopProviderDto((String) row[0], ((Number) row[1]).longValue()))
            .toList();

        return new AnalyticsDto(
            userRepository.count(),
            bookingRepository.count(),
            serviceRepository.count(),
            bookingRepository.countByStatus(BookingStatus.FLAGGED),
            mostBookedService,
            topProviders
        );
    }

    @Transactional(readOnly = true)
    public List<ChartPointDto> bookingsPerDay(int days) {
        LocalDate start = LocalDate.now().minusDays(Math.max(1, days) - 1L);
        Map<LocalDate, Long> counts = bookingRepository.findByCreatedAtAfter(start.atStartOfDay()).stream()
            .collect(Collectors.groupingBy(booking -> booking.getCreatedAt().toLocalDate(), TreeMap::new, Collectors.counting()));
        return start.datesUntil(LocalDate.now().plusDays(1))
            .map(day -> new ChartPointDto(day.toString(), counts.getOrDefault(day, 0L)))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ChartPointDto> topCategories() {
        return bookingRepository.findAll().stream()
            .collect(Collectors.groupingBy(booking -> booking.getService().getCategory().name(), Collectors.counting()))
            .entrySet()
            .stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .map(entry -> new ChartPointDto(entry.getKey(), entry.getValue()))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ChartPointDto> fraudTrends(int days) {
        LocalDateTime start = LocalDate.now().minusDays(Math.max(1, days) - 1L).atStartOfDay();
        Map<LocalDate, Long> flagged = bookingRepository.findByCreatedAtAfter(start).stream()
            .filter(booking -> booking.getStatus() == BookingStatus.FLAGGED)
            .collect(Collectors.groupingBy(booking -> booking.getCreatedAt().toLocalDate(), TreeMap::new, Collectors.counting()));
        return start.toLocalDate().datesUntil(LocalDate.now().plusDays(1))
            .map(day -> new ChartPointDto(day.toString(), flagged.getOrDefault(day, 0L)))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<Booking> recentFraudAlerts(int limit) {
        return bookingRepository.findAll().stream()
            .filter(booking -> booking.getStatus() == BookingStatus.FLAGGED)
            .sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
            .limit(limit)
            .toList();
    }
}
