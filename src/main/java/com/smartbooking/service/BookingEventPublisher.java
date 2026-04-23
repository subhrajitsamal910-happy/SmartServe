package com.smartbooking.service;

import com.smartbooking.config.MessagingConfig;
import com.smartbooking.dto.BookingEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class BookingEventPublisher {
    private static final Logger log = LoggerFactory.getLogger(BookingEventPublisher.class);
    private final RabbitTemplate rabbitTemplate;
    private final boolean rabbitEnabled;

    public BookingEventPublisher(ObjectProvider<RabbitTemplate> rabbitTemplateProvider,
                                 @Value("${app.messaging.rabbit-enabled:false}") boolean rabbitEnabled) {
        this.rabbitTemplate = rabbitTemplateProvider.getIfAvailable();
        this.rabbitEnabled = rabbitEnabled;
    }

    public void publishBookingCreated(BookingEventDto event) {
        if (!rabbitEnabled || rabbitTemplate == null) {
            log.debug("Skipping RabbitMQ publish for booking event {} because messaging is disabled in this profile", event.bookingId());
            return;
        }
        try {
            rabbitTemplate.convertAndSend(MessagingConfig.BOOKING_EVENTS_EXCHANGE, MessagingConfig.BOOKING_CREATED_ROUTING_KEY, event);
        } catch (Exception ex) {
            log.warn("RabbitMQ publish failed for booking event {}. Continuing without async queue dispatch.", event.bookingId());
        }
    }
}
