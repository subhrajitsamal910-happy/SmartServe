package com.smartbooking.service;

import com.smartbooking.dto.BookingNotificationDto;
import com.smartbooking.entity.Booking;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class RealtimeNotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public RealtimeNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publishBookingCreated(Booking booking) {
        BookingNotificationDto payload = new BookingNotificationDto(
            booking.getId(),
            booking.getService().getTitle(),
            booking.getStatus(),
            booking.getRiskScore(),
            booking.getCreatedAt()
        );
        messagingTemplate.convertAndSend("/topic/bookings", payload);
    }
}
