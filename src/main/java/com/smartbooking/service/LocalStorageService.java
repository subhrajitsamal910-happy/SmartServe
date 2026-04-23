package com.smartbooking.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@ConditionalOnProperty(name = "storage.mode", havingValue = "local", matchIfMissing = true)
public class LocalStorageService implements StorageService {
    @Value("${storage.local-base-url:http://localhost:8080/uploads}")
    private String baseUrl;

    @Override
    public String upload(MultipartFile file, String folder) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                : ".bin";
            String filename = UUID.randomUUID() + extension;
            Path directory = Path.of("uploads", folder);
            Files.createDirectories(directory);
            Path target = directory.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return baseUrl + "/" + folder + "/" + filename;
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store file locally", ex);
        }
    }
}
