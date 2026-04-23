package com.smartbooking.repository;

import com.smartbooking.entity.Rating;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByServiceId(Long serviceId);

    Optional<Rating> findByUserIdAndServiceId(Long userId, Long serviceId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Rating r WHERE r.service.id = :serviceId")
    Double findAverageRatingByServiceId(Long serviceId);

    long countByServiceId(Long serviceId);
}
