package com.smartbooking.repository;

import com.smartbooking.entity.UserBehaviorHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBehaviorHistoryRepository extends JpaRepository<UserBehaviorHistory, Long> {
    List<UserBehaviorHistory> findTop50ByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT h.service.id FROM UserBehaviorHistory h WHERE h.user.id = :userId AND h.service IS NOT NULL")
    List<Long> findTouchedServiceIdsByUser(Long userId);
}
