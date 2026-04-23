package com.smartbooking.repository;

import com.smartbooking.entity.ServiceEntity;
import com.smartbooking.model.ServiceCategory;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    @Override
    @EntityGraph(attributePaths = "provider")
    @NonNull
    List<ServiceEntity> findAll();

    @Override
    @EntityGraph(attributePaths = "provider")
    @NonNull
    Optional<ServiceEntity> findById(@NonNull Long id);

    @EntityGraph(attributePaths = "provider")
    List<ServiceEntity> findByCategory(ServiceCategory category);

    @EntityGraph(attributePaths = "provider")
    @Query("SELECT s FROM ServiceEntity s ORDER BY (SELECT COALESCE(AVG(r.rating), 0) FROM Rating r WHERE r.service = s) DESC")
    List<ServiceEntity> findAllOrderByAverageRatingDesc();
}
