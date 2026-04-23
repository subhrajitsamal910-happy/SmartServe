package com.smartbooking.service;

import com.smartbooking.dto.BookingRequestDto;
import com.smartbooking.dto.BookingResponseDto;
import com.smartbooking.dto.BookingEventDto;
import com.smartbooking.dto.FraudAssessmentDto;
import com.smartbooking.dto.PaymentResultDto;
import com.smartbooking.entity.Booking;
import com.smartbooking.entity.ServiceEntity;
import com.smartbooking.entity.User;
import com.smartbooking.exception.ResourceNotFoundException;
import com.smartbooking.model.BehaviorAction;
import com.smartbooking.model.BookingStatus;
import com.smartbooking.repository.BookingRepository;
import com.smartbooking.repository.ServiceRepository;
import com.smartbooking.repository.UserRepository;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {
    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final EmailService emailService;
    private final FraudDetectionService fraudDetectionService;
    private final PaymentService paymentService;
    private final BehaviorHistoryService behaviorHistoryService;
    private final RealtimeNotificationService realtimeNotificationService;
    private final BookingEventPublisher bookingEventPublisher;
    private final CacheManager cacheManager;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, ServiceRepository serviceRepository, EmailService emailService, FraudDetectionService fraudDetectionService, PaymentService paymentService, BehaviorHistoryService behaviorHistoryService, RealtimeNotificationService realtimeNotificationService, BookingEventPublisher bookingEventPublisher, CacheManager cacheManager) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.emailService = emailService;
        this.fraudDetectionService = fraudDetectionService;
        this.paymentService = paymentService;
        this.behaviorHistoryService = behaviorHistoryService;
        this.realtimeNotificationService = realtimeNotificationService;
        this.bookingEventPublisher = bookingEventPublisher;
        this.cacheManager = cacheManager;
    }

    @Transactional
    public BookingResponseDto createBooking(Long userId, BookingRequestDto request) {
        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        Long serviceId = Objects.requireNonNull(request.getServiceId(), "serviceId is required");
        User user = findUser(safeUserId);
        ServiceEntity service = serviceRepository.findById(serviceId)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found."));

        LocalDateTime requestedAt = Objects.requireNonNull(request.getScheduledAt(), "scheduledAt is required");
        int durationMinutes = request.getDurationMinutes() <= 0 ? 60 : request.getDurationMinutes();

        LocalDateTime conflictSuggestion = suggestNextSlot(service, requestedAt, durationMinutes);
        if (!conflictSuggestion.equals(requestedAt.truncatedTo(ChronoUnit.MINUTES))) {
            return new BookingResponseDto(
                null,
                safeUserId,
                service.getId(),
                service.getTitle(),
                BookingStatus.FLAGGED,
                0,
                "Requested time conflicts with provider availability.",
                List.of("SCHEDULE_CONFLICT"),
                com.smartbooking.model.PaymentStatus.FAILED,
                null,
                requestedAt,
                durationMinutes,
                conflictSuggestion,
                LocalDateTime.now()
            );
        }

        FraudAssessmentDto fraud = fraudDetectionService.assess(safeUserId, service);
        PaymentResultDto payment = paymentService.process(user, service, fraud.getRiskScore());

        Booking booking = bookingRepository.save(new Booking(
            user,
            service,
            fraud.getStatus(),
            fraud.getRiskScore(),
            fraud.getMessage(),
            payment.getStatus(),
            payment.getTransactionId(),
            requestedAt,
            durationMinutes
        ));

        behaviorHistoryService.record(user, service, BehaviorAction.BOOKING_CREATED, "status=" + fraud.getStatus() + ",riskScore=" + fraud.getRiskScore());
        evictRecommendationCache(safeUserId);
        realtimeNotificationService.publishBookingCreated(booking);
        bookingEventPublisher.publishBookingCreated(new BookingEventDto(
            booking.getId(),
            booking.getUser().getId(),
            booking.getService().getId(),
            booking.getService().getTitle(),
            booking.getStatus(),
            booking.getScheduledAt(),
            booking.getCreatedAt()
        ));

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            emailService.sendBookingConfirmed(booking);
        } else {
            log.warn("Booking {} flagged with risk score {} and signals {}", booking.getId(), fraud.getRiskScore(), fraud.getSignals());
        }

        return toDto(booking, fraud.getSignals());
    }

    @Transactional
    public BookingResponseDto cancelBooking(Long bookingId, Long userId, boolean admin) {
        Long safeBookingId = Objects.requireNonNull(bookingId, "bookingId is required");
        Long safeUserId = userId == null ? null : Objects.requireNonNull(userId, "userId is required");
        Booking booking = bookingRepository.findById(safeBookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));
        if (!admin && !booking.getUser().getId().equals(safeUserId)) {
            throw new IllegalArgumentException("You can cancel only your own bookings.");
        }
        booking.setStatus(com.smartbooking.model.BookingStatus.CANCELLED);
        emailService.sendBookingCancelled(booking);
        return toDto(booking, List.of());
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getMyBookings(Long userId) {
        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        return bookingRepository.findByUserId(safeUserId).stream()
            .sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
            .map(booking -> toDto(booking, List.of()))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAll().stream()
            .sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
            .map(booking -> toDto(booking, List.of()))
            .toList();
    }

    private void evictRecommendationCache(Long userId) {
        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        org.springframework.cache.Cache cache = cacheManager.getCache("recommendations");
        if (cache != null) {
            cache.evict(safeUserId);
        }
    }

    private User findUser(Long userId) {
        Long safeUserId = Objects.requireNonNull(userId, "userId is required");
        return userRepository.findById(safeUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }

    private BookingResponseDto toDto(Booking booking, List<String> fraudSignals) {
        return new BookingResponseDto(
            booking.getId(),
            booking.getUser().getId(),
            booking.getService().getId(),
            booking.getService().getTitle(),
            booking.getStatus(),
            booking.getRiskScore(),
            booking.getFraudMessage(),
            fraudSignals,
            booking.getPaymentStatus(),
            booking.getPaymentTransactionId(),
            booking.getScheduledAt(),
            booking.getDurationMinutes(),
            null,
            booking.getCreatedAt()
        );
    }

    private LocalDateTime suggestNextSlot(ServiceEntity service, LocalDateTime requestedAt, int durationMinutes) {
        LocalDateTime requested = requestedAt.truncatedTo(ChronoUnit.MINUTES);
        LocalDateTime searchFrom = requested.minusHours(1);
        LocalDateTime searchTo = requested.plusHours(8);

        List<Booking> nearBookings = bookingRepository.findByServiceProviderIdAndStatusInAndScheduledAtBetween(
            service.getProvider().getId(),
            List.of(BookingStatus.CONFIRMED, BookingStatus.FLAGGED),
            searchFrom,
            searchTo
        );

        boolean hasConflict = nearBookings.stream().anyMatch(existing -> overlaps(
            requested,
            requested.plusMinutes(durationMinutes),
            existing.getScheduledAt(),
            existing.getScheduledAt().plusMinutes(existing.getDurationMinutes())
        ));

        if (!hasConflict) {
            return requested;
        }

        LocalDateTime suggestion = requested.plusMinutes(30);
        for (int i = 0; i < 10; i++) {
            LocalDateTime candidateStart = suggestion;
            LocalDateTime candidateEnd = candidateStart.plusMinutes(durationMinutes);
            boolean occupied = nearBookings.stream().anyMatch(existing -> overlaps(
                candidateStart,
                candidateEnd,
                existing.getScheduledAt(),
                existing.getScheduledAt().plusMinutes(existing.getDurationMinutes())
            ));
            if (!occupied) {
                return candidateStart;
            }
            suggestion = suggestion.plusMinutes(30);
        }

        return suggestion;
    }

    private boolean overlaps(LocalDateTime startA, LocalDateTime endA, LocalDateTime startB, LocalDateTime endB) {
        return startA.isBefore(endB) && startB.isBefore(endA);
    }
}
