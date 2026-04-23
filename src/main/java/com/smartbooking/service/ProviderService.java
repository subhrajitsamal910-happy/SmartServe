package com.smartbooking.service;

import com.smartbooking.dto.ProviderResponseDto;
import com.smartbooking.entity.ServiceProvider;
import com.smartbooking.exception.ResourceNotFoundException;
import com.smartbooking.repository.ProviderRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProviderService {
    private final ProviderRepository providerRepository;
    private final StorageService storageService;

    public ProviderService(ProviderRepository providerRepository, StorageService storageService) {
        this.providerRepository = providerRepository;
        this.storageService = storageService;
    }

    @Transactional(readOnly = true)
    public List<ProviderResponseDto> listProviders() {
        return providerRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public ProviderResponseDto updateAvailability(@NonNull Long providerId, boolean available) {
        ServiceProvider provider = providerRepository.findById(providerId)
            .orElseThrow(() -> new ResourceNotFoundException("Provider not found."));
        provider.setAvailable(available);
        return toDto(provider);
    }

    @Transactional
    public ProviderResponseDto uploadAvatar(@NonNull Long providerId, MultipartFile file) {
        ServiceProvider provider = providerRepository.findById(providerId)
            .orElseThrow(() -> new ResourceNotFoundException("Provider not found."));
        String url = storageService.upload(file, "providers");
        provider.setAvatarUrl(url);
        return toDto(provider);
    }

    private ProviderResponseDto toDto(ServiceProvider provider) {
        return new ProviderResponseDto(
            provider.getId(),
            provider.getName(),
            provider.getEmail(),
            provider.getPhone(),
            provider.isAvailable(),
            provider.getAvatarUrl()
        );
    }
}
