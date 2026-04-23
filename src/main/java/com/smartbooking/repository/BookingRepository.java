package com.smartbooking.repository;

import com.smartbooking.entity.Booking;
import com.smartbooking.model.BookingStatus;
import com.smartbooking.model.ServiceCategory;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    long countByUserIdAndCreatedAtAfter(Long userId, LocalDateTime createdAt);

    long countByServiceId(Long serviceId);

    long countByStatus(BookingStatus status);

    long countByUserIdAndServiceIdAndCreatedAtAfter(Long userId, Long serviceId, LocalDateTime createdAt);

    List<Booking> findByCreatedAtAfter(LocalDateTime createdAt);

    List<Booking> findByServiceProviderIdAndStatusInAndScheduledAtBetween(Long providerId, List<BookingStatus> statuses, LocalDateTime from, LocalDateTime to);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT b.service.category FROM Booking b WHERE b.user.id = :userId GROUP BY b.service.category ORDER BY COUNT(b) DESC")
    List<ServiceCategory> findMostBookedCategoriesByUser(Long userId, Pageable pageable);

    @Query("SELECT b.service.title FROM Booking b GROUP BY b.service.title ORDER BY COUNT(b) DESC")
    List<String> findMostBookedServiceTitle(Pageable pageable);

    @Query("SELECT b.service.provider.name, COUNT(b) FROM Booking b GROUP BY b.service.provider.name ORDER BY COUNT(b) DESC")
    List<Object[]> findTopProviders(Pageable pageable);
}
