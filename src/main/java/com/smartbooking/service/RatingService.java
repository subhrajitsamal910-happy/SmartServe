package com.smartbooking.service;

import com.smartbooking.dto.RatingRequestDto;
import com.smartbooking.dto.RatingResponseDto;
import com.smartbooking.entity.Rating;
import com.smartbooking.entity.ServiceEntity;
import com.smartbooking.entity.User;
import com.smartbooking.exception.DuplicateResourceException;
import com.smartbooking.exception.ResourceNotFoundException;
import com.smartbooking.repository.RatingRepository;
import com.smartbooking.repository.ServiceRepository;
import com.smartbooking.repository.UserRepository;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RatingService {
    private final RatingRepository ratingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public RatingService(RatingRepository ratingRepository, ServiceRepository serviceRepository, UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RatingResponseDto addRating(Long userId, RatingRequestDto request) {
        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        Long safeServiceId = Objects.requireNonNull(request.getServiceId(), "serviceId is required");
        User user = userRepository.findById(safeUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        ServiceEntity service = serviceRepository.findById(safeServiceId)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found."));

        ratingRepository.findByUserIdAndServiceId(safeUserId, service.getId()).ifPresent(rating -> {
            throw new DuplicateResourceException("You have already rated this service.");
        });

        return toDto(ratingRepository.save(new Rating(user, service, request.getRating(), request.getReview())));
    }

    public List<RatingResponseDto> getRatingsByServiceId(Long serviceId) {
        Long safeServiceId = Objects.requireNonNull(serviceId, "serviceId is required");
        return ratingRepository.findByServiceId(safeServiceId).stream().map(this::toDto).toList();
    }

    public double getAverageRating(Long serviceId) {
        Long safeServiceId = Objects.requireNonNull(serviceId, "serviceId is required");
        Double average = ratingRepository.findAverageRatingByServiceId(safeServiceId);
        return average == null ? 0.0 : average;
    }

    public long getRatingCount(Long serviceId) {
        Long safeServiceId = Objects.requireNonNull(serviceId, "serviceId is required");
        return ratingRepository.countByServiceId(safeServiceId);
    }

    private RatingResponseDto toDto(Rating rating) {
        return new RatingResponseDto(
            rating.getId(),
            rating.getUser().getId(),
            rating.getService().getId(),
            rating.getRating(),
            rating.getReview(),
            rating.getCreatedAt()
        );
    }
}
