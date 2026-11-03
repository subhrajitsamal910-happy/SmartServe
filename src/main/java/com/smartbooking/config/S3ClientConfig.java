package com.smartbooking.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

/**
 * S3 client configuration - disabled for local development.
 * To enable: add AWS SDK dependency to pom.xml and set storage.mode=s3
 */
@Configuration
@ConditionalOnProperty(name = "storage.mode", havingValue = "s3")
public class S3ClientConfig {
    // S3Client bean removed for local development.
    // Re-add AWS SDK to pom.xml and restore bean when deploying to cloud.
}
