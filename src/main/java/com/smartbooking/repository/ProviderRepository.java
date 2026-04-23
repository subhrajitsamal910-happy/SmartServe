package com.smartbooking.repository;

import com.smartbooking.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProviderRepository extends JpaRepository<ServiceProvider, Long> {
}
