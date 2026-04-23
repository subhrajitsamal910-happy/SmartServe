package com.smartbooking.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "app.messaging.rabbit-enabled", havingValue = "true")
public class MessagingConfig {
    public static final String BOOKING_EVENTS_EXCHANGE = "booking.events.exchange";
    public static final String BOOKING_EVENTS_QUEUE = "booking.events.queue";
    public static final String BOOKING_CREATED_ROUTING_KEY = "booking.created";

    @Bean
    public TopicExchange bookingEventsExchange() {
        return new TopicExchange(BOOKING_EVENTS_EXCHANGE);
    }

    @Bean
    public Queue bookingEventsQueue() {
        return new Queue(BOOKING_EVENTS_QUEUE, true);
    }

    @Bean
    public Binding bookingEventsBinding(Queue bookingEventsQueue, TopicExchange bookingEventsExchange) {
        return BindingBuilder.bind(bookingEventsQueue).to(bookingEventsExchange).with(BOOKING_CREATED_ROUTING_KEY);
    }
}
