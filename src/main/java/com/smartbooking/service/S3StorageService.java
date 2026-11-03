package com.smartbooking.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * S3 storage implementation - disabled for local development.
 * To enable: add AWS SDK dependency to pom.xml and set storage.mode=s3
 */
@Service
@ConditionalOnProperty(name = "storage.mode", havingValue = "s3")
public class S3StorageService implements StorageService {

    @Override
    public String upload(MultipartFile file, String folder) {
        throw new UnsupportedOperationException(
            "S3 storage is not configured. Set storage.mode=local or configure AWS credentials."
        );
    }
}
