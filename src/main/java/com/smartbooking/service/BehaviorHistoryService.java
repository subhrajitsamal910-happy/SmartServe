package com.smartbooking.service;

import com.smartbooking.entity.ServiceEntity;
import com.smartbooking.entity.User;
import com.smartbooking.entity.UserBehaviorHistory;
import com.smartbooking.model.BehaviorAction;
import com.smartbooking.repository.UserBehaviorHistoryRepository;
import org.springframework.stereotype.Service;

@Service
public class BehaviorHistoryService {
    private final UserBehaviorHistoryRepository repository;

    public BehaviorHistoryService(UserBehaviorHistoryRepository repository) {
        this.repository = repository;
    }

    public void record(User user, ServiceEntity service, BehaviorAction action, String metadata) {
        if (service == null) {
            return;
        }
        repository.save(new UserBehaviorHistory(user, service, service.getCategory(), action, metadata));
    }
}
