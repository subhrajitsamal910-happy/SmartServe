package com.smartbooking.controller;

import com.smartbooking.dto.BookingRequestDto;
import com.smartbooking.dto.BookingResponseDto;
import com.smartbooking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Booking", description = "Authenticated service booking APIs")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/my")
    @Operation(summary = "List my bookings", description = "Returns bookings for the current JWT user.")
    public ResponseEntity<List<BookingResponseDto>> myBookings(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @PostMapping
    @Operation(
        summary = "Book a service",
        description = "Creates a confirmed booking for the authenticated user. The user id is read from the JWT token.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = "{\"serviceId\":1}"))),
        responses = {
            @ApiResponse(responseCode = "200", description = "Booking confirmed"),
            @ApiResponse(responseCode = "429", description = "Fraud velocity rule flagged the booking")
        }
    )
    public ResponseEntity<BookingResponseDto> bookService(@AuthenticationPrincipal Long userId, @Valid @RequestBody BookingRequestDto request) {
        return ResponseEntity.ok(bookingService.createBooking(userId, request));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking", description = "Users can cancel their own bookings. Admins can cancel any booking.")
    public ResponseEntity<BookingResponseDto> cancelBooking(@PathVariable Long id, @AuthenticationPrincipal Long userId, Authentication authentication) {
        boolean admin = authentication.getAuthorities().stream().anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId, admin));
    }
}
