package com.smartbooking.controller;

import com.smartbooking.dto.BookingResponseDto;
import com.smartbooking.dto.ServiceResponseDto;
import com.smartbooking.model.BookingStatus;
import com.smartbooking.service.AnalyticsService;
import com.smartbooking.service.BookingService;
import com.smartbooking.service.ServiceCatalogService;
import io.swagger.v3.oas.annotations.Hidden;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Hidden
public class WebController {
    private final ServiceCatalogService serviceCatalogService;
    private final BookingService bookingService;
    private final AnalyticsService analyticsService;

    public WebController(ServiceCatalogService serviceCatalogService, BookingService bookingService, AnalyticsService analyticsService) {
        this.serviceCatalogService = serviceCatalogService;
        this.bookingService = bookingService;
        this.analyticsService = analyticsService;
    }

    @GetMapping("/ui/login")
    public String login() {
        return "login";
    }

    @GetMapping("/ui/dashboard")
    public String dashboard(Model model) {
        List<ServiceResponseDto> topServices = topServices();
        List<BookingResponseDto> bookings = bookingService.getAllBookings();
        model.addAttribute("analytics", analyticsService.getAdminAnalytics());
        model.addAttribute("topServices", topServices);
        model.addAttribute("fraudAlerts", bookings.stream().filter(booking -> booking.getStatus() == BookingStatus.FLAGGED).limit(5).toList());
        return "dashboard";
    }

    @GetMapping("/ui/services")
    public String services(Model model) {
        model.addAttribute("services", serviceCatalogService.getServices(null));
        return "services";
    }

    @GetMapping("/ui/bookings")
    public String bookings(Model model) {
        model.addAttribute("bookings", bookingService.getAllBookings());
        return "bookings";
    }

    @GetMapping("/ui/admin")
    public String admin(Model model) {
        model.addAttribute("analytics", analyticsService.getAdminAnalytics());
        model.addAttribute("bookingsPerDay", analyticsService.bookingsPerDay(7));
        model.addAttribute("topCategories", analyticsService.topCategories());
        model.addAttribute("fraudTrends", analyticsService.fraudTrends(7));
        return "admin";
    }

    @GetMapping("/ui/book")
    public String booking(Model model) {
        model.addAttribute("services", serviceCatalogService.getServices(null));
        return "booking";
    }

    private List<ServiceResponseDto> topServices() {
        return serviceCatalogService.getServices(null).stream()
            .sorted(Comparator.comparingLong(ServiceResponseDto::getBookingCount).reversed()
                .thenComparing(Comparator.comparingDouble(ServiceResponseDto::getAverageRating).reversed()))
            .limit(5)
            .toList();
    }
}
