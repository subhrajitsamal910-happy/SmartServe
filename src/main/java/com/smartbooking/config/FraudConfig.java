package com.smartbooking.config;

import com.smartbooking.repository.BookingRepository;
import com.smartbooking.service.FraudDetectionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FraudConfig {
    @Bean
    public FraudDetectionService fraudDetectionService(
        BookingRepository bookingRepository,
        @Value("${smartserve.ai.fraud.flag-threshold:70}") int flagThreshold
    ) {
        return new FraudDetectionService(bookingRepository, flagThreshold);
    }
}
