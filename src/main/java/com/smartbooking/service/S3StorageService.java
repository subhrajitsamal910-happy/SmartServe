package com.smartbooking.service;

import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@ConditionalOnProperty(name = "storage.mode", havingValue = "s3")
public class S3StorageService implements StorageService {
    private final S3Client s3Client;

    @Value("${storage.bucket:}")
    private String bucket;

    @Value("${storage.region:us-east-1}")
    private String region;

    public S3StorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String upload(MultipartFile file, String folder) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                : ".bin";
            String key = folder + "/" + UUID.randomUUID() + extension;
            PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(file.getContentType())
                .build();

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
            return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to upload file to S3", ex);
        }
    }
}
