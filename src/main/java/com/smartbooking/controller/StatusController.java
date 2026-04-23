package com.smartbooking.controller;

import com.smartbooking.dto.StatusResponseDto;
import com.smartbooking.repository.BookingRepository;
import com.smartbooking.repository.ServiceRepository;
import com.smartbooking.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Status", description = "Public application health and status endpoints")
public class StatusController {
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;

    public StatusController(UserRepository userRepository, ServiceRepository serviceRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping({"/status", "/health", "/api/status"})
    @Operation(summary = "System status", description = "Demo-friendly status endpoint showing application availability and core counts.")
    public ResponseEntity<StatusResponseDto> status() {
        return ResponseEntity.ok(new StatusResponseDto(
            "SmartServe AI – Intelligent Local Service Booking Platform",
            "UP",
            Instant.now(),
            Map.of(
                "users", userRepository.count(),
                "services", serviceRepository.count(),
                "bookings", bookingRepository.count()
            )
        ));
    }
}
