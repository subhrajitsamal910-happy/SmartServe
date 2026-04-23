package com.smartbooking.service;

import com.smartbooking.dto.RecommendationDto;
import com.smartbooking.dto.ServiceResponseDto;
import com.smartbooking.entity.Booking;
import com.smartbooking.entity.ServiceEntity;
import com.smartbooking.entity.User;
import com.smartbooking.entity.UserBehaviorHistory;
import com.smartbooking.exception.ResourceNotFoundException;
import com.smartbooking.model.BehaviorAction;
import com.smartbooking.model.ServiceCategory;
import com.smartbooking.repository.BookingRepository;
import com.smartbooking.repository.ServiceRepository;
import com.smartbooking.repository.UserBehaviorHistoryRepository;
import com.smartbooking.repository.UserRepository;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RecommendationService {
    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final ServiceCatalogService serviceCatalogService;
    private final UserRepository userRepository;
    private final UserBehaviorHistoryRepository behaviorHistoryRepository;
    private final BehaviorHistoryService behaviorHistoryService;

    @Value("${smartserve.ai.recommendation.weights.collaborative:0.34}")
    private double collaborativeWeight;

    @Value("${smartserve.ai.recommendation.weights.category:0.18}")
    private double categoryWeight;

    @Value("${smartserve.ai.recommendation.weights.rating:0.20}")
    private double ratingWeight;

    @Value("${smartserve.ai.recommendation.weights.popularity:0.16}")
    private double popularityWeight;

    @Value("${smartserve.ai.recommendation.weights.behavior:0.10}")
    private double behaviorWeight;

    @Value("${smartserve.ai.recommendation.weights.freshness:0.02}")
    private double freshnessWeight;

    public RecommendationService(BookingRepository bookingRepository, ServiceRepository serviceRepository, ServiceCatalogService serviceCatalogService, UserRepository userRepository, UserBehaviorHistoryRepository behaviorHistoryRepository, BehaviorHistoryService behaviorHistoryService) {
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
        this.serviceCatalogService = serviceCatalogService;
        this.userRepository = userRepository;
        this.behaviorHistoryRepository = behaviorHistoryRepository;
        this.behaviorHistoryService = behaviorHistoryService;
    }

    @Transactional
    @Cacheable(value = "recommendations", key = "#userId")
    public RecommendationDto recommendServicesForUser(Long userId) {
        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        User user = userRepository.findById(safeUserId).orElseThrow(() -> new ResourceNotFoundException("User not found."));
        List<UserBehaviorHistory> recentBehavior = behaviorHistoryRepository.findTop50ByUserIdOrderByCreatedAtDesc(safeUserId);
        Set<Long> bookedServiceIds = new HashSet<>(bookingRepository.findByUserId(safeUserId).stream().map(booking -> booking.getService().getId()).toList());
        bookedServiceIds.addAll(behaviorHistoryRepository.findTouchedServiceIdsByUser(safeUserId));

        Map<Long, Long> collaborativeScores = collaborativeScores(safeUserId, bookedServiceIds);
        Map<Long, Double> behaviorScores = buildBehaviorScores(recentBehavior);
        ServiceCategory preferredCategory = preferredCategory(safeUserId, recentBehavior);

        long maxCollaborative = Math.max(1L, collaborativeScores.values().stream().mapToLong(Long::longValue).max().orElse(1L));
        double maxBehavior = Math.max(1.0, behaviorScores.values().stream().mapToDouble(Double::doubleValue).max().orElse(1.0));
        long maxPopularity = Math.max(1L, serviceRepository.findAll().stream().mapToLong(service -> bookingRepository.countByServiceId(service.getId())).max().orElse(1L));

        List<ScoredService> ranked = serviceRepository.findAll().stream()
            .filter(service -> !bookedServiceIds.contains(service.getId()))
            .map(service -> score(service, preferredCategory, collaborativeScores.getOrDefault(service.getId(), 0L), maxCollaborative, behaviorScores.getOrDefault(service.getId(), 0.0), maxBehavior, maxPopularity))
            .sorted(Comparator.comparingDouble(ScoredService::score).reversed())
            .limit(6)
            .toList();

        List<ServiceResponseDto> recommended = ranked.stream().map(scored -> scored.service()).toList();

        ranked.stream().limit(3).forEach(scoredService -> {
            Long safeServiceId = Objects.requireNonNull(scoredService.service().getId(), "serviceId is required");
            ServiceEntity entity = serviceRepository.findById(safeServiceId).orElse(null);
            String metadata = "score=%.2f".formatted(scoredService.score());
            behaviorHistoryService.record(user, entity, BehaviorAction.RECOMMENDATION_VIEWED, metadata);
        });

        String logic = "Hybrid AI recommendation: users-who-booked-X-also-booked-Y collaborative filtering with weighted scoring (category affinity, rating, popularity, recent behavior, freshness).";
        return new RecommendationDto(safeUserId, logic, recommended);
    }

    @CacheEvict(value = "recommendations", key = "#userId")
    public void evictUserRecommendations(Long userId) {
        // Invoked by future integrations after behavior changes; current booking flow persists fresh history.
    }

    private Map<Long, Long> collaborativeScores(Long userId, Set<Long> bookedServiceIds) {
        Map<Long, Long> scores = new HashMap<>();
        if (bookedServiceIds.isEmpty()) {
            return scores;
        }

        Map<Long, Set<Long>> servicesByOtherUser = new HashMap<>();
        for (Booking booking : bookingRepository.findAll()) {
            if (!booking.getUser().getId().equals(userId)) {
                servicesByOtherUser.computeIfAbsent(booking.getUser().getId(), ignored -> new HashSet<>()).add(booking.getService().getId());
            }
        }

        for (Set<Long> otherUserServices : servicesByOtherUser.values()) {
            long overlapCount = otherUserServices.stream().filter(bookedServiceIds::contains).count();
            if (overlapCount == 0) {
                continue;
            }
            otherUserServices.stream()
                .filter(serviceId -> !bookedServiceIds.contains(serviceId))
                .forEach(serviceId -> scores.merge(serviceId, overlapCount, (left, right) -> left + right));
        }
        return scores;
    }

    private ServiceCategory preferredCategory(Long userId, List<UserBehaviorHistory> behaviorHistory) {
        Map<ServiceCategory, Double> categoryWeights = new HashMap<>();
        bookingRepository.findByUserId(userId).forEach(booking -> categoryWeights.merge(booking.getService().getCategory(), 1.0, (left, right) -> left + right));
        behaviorHistory.forEach(history -> categoryWeights.merge(history.getCategory(), behaviorActionWeight(history.getAction()) * 0.6, (left, right) -> left + right));
        return categoryWeights.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(null);
    }

    private Map<Long, Double> buildBehaviorScores(List<UserBehaviorHistory> behaviorHistory) {
        Map<Long, Double> scores = new HashMap<>();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        for (UserBehaviorHistory history : behaviorHistory) {
            if (history.getService() == null) {
                continue;
            }
            long ageHours = java.time.Duration.between(history.getCreatedAt(), now).toHours();
            double recencyFactor = Math.max(0.2, 1.0 - (ageHours / 336.0));
            double score = behaviorActionWeight(history.getAction()) * recencyFactor;
            scores.merge(history.getService().getId(), score, (left, right) -> left + right);
        }
        return scores;
    }

    private double behaviorActionWeight(BehaviorAction action) {
        return switch (action) {
            case BOOKING_CREATED -> 1.0;
            case RECOMMENDATION_VIEWED -> 0.7;
            case CHAT_QUERY -> 0.4;
        };
    }

    private ScoredService score(
        ServiceEntity service,
        ServiceCategory preferredCategory,
        long collaborativeScore,
        long maxCollaborative,
        double behaviorScore,
        double maxBehavior,
        long maxPopularity
    ) {
        ServiceResponseDto dto = serviceCatalogService.toDto(service);
        double normalizedRating = Math.min(1.0, Math.max(0.0, dto.getAverageRating() / 5.0));
        double normalizedPopularity = Math.min(1.0, Math.max(0.0, dto.getBookingCount() / (double) maxPopularity));
        double normalizedCollaborative = Math.min(1.0, collaborativeScore / (double) maxCollaborative);
        double normalizedBehavior = Math.min(1.0, behaviorScore / maxBehavior);
        double categorySignal = preferredCategory != null && service.getCategory() == preferredCategory ? 1.0 : 0.0;
        double freshnessSignal = service.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(30)) ? 1.0 : 0.0;

        double finalScore = 100.0 * (
            normalizedCollaborative * collaborativeWeight
                + categorySignal * categoryWeight
                + normalizedRating * ratingWeight
                + normalizedPopularity * popularityWeight
                + normalizedBehavior * behaviorWeight
                + freshnessSignal * freshnessWeight
        );
        return new ScoredService(dto, finalScore);
    }

    private record ScoredService(ServiceResponseDto service, double score) {
    }
}
