package com.smartbooking.controller;

import com.smartbooking.dto.AnalyticsDto;
import com.smartbooking.dto.BookingResponseDto;
import com.smartbooking.dto.ChartPointDto;
import com.smartbooking.service.AnalyticsService;
import com.smartbooking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Admin-only analytics and monitoring APIs")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {
    private final AnalyticsService analyticsService;
    private final BookingService bookingService;

    public AdminController(AnalyticsService analyticsService, BookingService bookingService) {
        this.analyticsService = analyticsService;
        this.bookingService = bookingService;
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get platform analytics", description = "Admin-only summary including users, bookings, services, top providers, and flagged bookings.")
    public ResponseEntity<AnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(analyticsService.getAdminAnalytics());
    }

    @GetMapping("/analytics/bookings-per-day")
    @Operation(summary = "Get graph-ready bookings per day")
    public ResponseEntity<List<ChartPointDto>> bookingsPerDay(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(analyticsService.bookingsPerDay(days));
    }

    @GetMapping("/analytics/top-categories")
    @Operation(summary = "Get graph-ready top category data")
    public ResponseEntity<List<ChartPointDto>> topCategories() {
        return ResponseEntity.ok(analyticsService.topCategories());
    }

    @GetMapping("/analytics/fraud-trends")
    @Operation(summary = "Get graph-ready fraud trend data")
    public ResponseEntity<List<ChartPointDto>> fraudTrends(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(analyticsService.fraudTrends(days));
    }

    @GetMapping("/bookings")
    @Operation(summary = "List all bookings", description = "Admin-only booking feed for viva/demo monitoring.")
    public ResponseEntity<List<BookingResponseDto>> getBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}
