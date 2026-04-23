package com.smartbooking.service;

import com.smartbooking.config.MessagingConfig;
import com.smartbooking.dto.BookingEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.messaging.rabbit-enabled", havingValue = "true")
public class BookingEventListener {
    private static final Logger log = LoggerFactory.getLogger(BookingEventListener.class);

    @RabbitListener(queues = MessagingConfig.BOOKING_EVENTS_QUEUE)
    public void consumeBookingCreated(BookingEventDto event) {
        log.info("Async booking event consumed: bookingId={}, service={}, status={}", event.bookingId(), event.serviceTitle(), event.status());
    }
}
