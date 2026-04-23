package com.smartbooking.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
@ConditionalOnProperty(name = "storage.mode", havingValue = "s3")
public class S3ClientConfig {
    @Bean
    public S3Client s3Client(org.springframework.core.env.Environment environment) {
        return S3Client.builder()
            .region(Region.of(environment.getProperty("storage.region", "us-east-1")))
            .credentialsProvider(DefaultCredentialsProvider.create())
            .build();
    }
}
