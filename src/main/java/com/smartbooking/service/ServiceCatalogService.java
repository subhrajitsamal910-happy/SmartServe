package com.smartbooking.service;

import com.smartbooking.dto.ServiceResponseDto;
import com.smartbooking.entity.ServiceEntity;
import com.smartbooking.exception.ResourceNotFoundException;
import com.smartbooking.model.ServiceCategory;
import java.util.Arrays;
import java.util.HashSet;
import com.smartbooking.repository.BookingRepository;
import com.smartbooking.repository.ServiceRepository;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceCatalogService {
    private final ServiceRepository serviceRepository;
    private final RatingService ratingService;
    private final BookingRepository bookingRepository;

    public ServiceCatalogService(ServiceRepository serviceRepository, RatingService ratingService, BookingRepository bookingRepository) {
        this.serviceRepository = serviceRepository;
        this.ratingService = ratingService;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<ServiceResponseDto> getServices(ServiceCategory category) {
        List<ServiceEntity> services = category == null ? serviceRepository.findAll() : serviceRepository.findByCategory(category);
        return services.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ServiceResponseDto getService(Long id) {
        Long safeId = Objects.requireNonNull(id, "id is required");
        return toDto(findService(safeId));
    }

    public ServiceEntity findService(Long id) {
        Long safeId = Objects.requireNonNull(id, "id is required");
        return serviceRepository.findById(safeId)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found."));
    }

    @Transactional(readOnly = true)
    public List<ServiceResponseDto> semanticSearch(String query) {
        String safeQuery = query == null ? "" : query.trim();
        if (safeQuery.isBlank()) {
            return getServices(null);
        }

        Set<String> queryTokens = tokenize(safeQuery);
        return serviceRepository.findAll().stream()
            .map(service -> new ScoredService(toDto(service), scoreSemanticMatch(service.getTitle() + " " + service.getDescription(), queryTokens)))
            .filter(scored -> scored.score > 0)
            .sorted((a, b) -> Double.compare(b.score, a.score))
            .map(scored -> scored.dto)
            .limit(20)
            .toList();
    }

    private double scoreSemanticMatch(String corpus, Set<String> queryTokens) {
        Set<String> serviceTokens = tokenize(corpus);
        long overlap = queryTokens.stream().filter(serviceTokens::contains).count();
        if (overlap == 0) {
            return 0;
        }
        double jaccard = overlap / (double) (queryTokens.size() + serviceTokens.size() - overlap);
        return jaccard * 100;
    }

    private Set<String> tokenize(String value) {
        if (value == null) {
            return Set.of();
        }
        return new HashSet<>(Arrays.stream(value.toLowerCase().split("[^a-z0-9]+"))
            .filter(token -> token.length() > 1)
            .toList());
    }

    private static class ScoredService {
        private final ServiceResponseDto dto;
        private final double score;

        private ScoredService(ServiceResponseDto dto, double score) {
            this.dto = dto;
            this.score = score;
        }
    }

    public ServiceResponseDto toDto(ServiceEntity service) {
        double averageRating = ratingService.getAverageRating(service.getId());
        long ratingCount = ratingService.getRatingCount(service.getId());
        long bookingCount = bookingRepository.countByServiceId(service.getId());
        return new ServiceResponseDto(
            service.getId(),
            service.getTitle(),
            service.getDescription(),
            service.getCategory(),
            service.getProvider().getName(),
            service.getPrice(),
            service.getImageUrl(),
            service.getProvider().isAvailable(),
            averageRating,
            ratingCount,
            bookingCount
        );
    }
}
