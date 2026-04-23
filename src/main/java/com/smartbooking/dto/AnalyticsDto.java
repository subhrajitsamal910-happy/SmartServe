package com.smartbooking.dto;

import java.util.List;

public class AnalyticsDto {
    private long totalUsers;
    private long totalBookings;
    private long totalServices;
    private long flaggedBookings;
    private String mostBookedService;
    private List<TopProviderDto> topProviders;

    public AnalyticsDto(long totalUsers, long totalBookings, long totalServices, long flaggedBookings, String mostBookedService, List<TopProviderDto> topProviders) {
        this.totalUsers = totalUsers;
        this.totalBookings = totalBookings;
        this.totalServices = totalServices;
        this.flaggedBookings = flaggedBookings;
        this.mostBookedService = mostBookedService;
        this.topProviders = topProviders;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public long getTotalServices() {
        return totalServices;
    }

    public long getFlaggedBookings() {
        return flaggedBookings;
    }

    public String getMostBookedService() {
        return mostBookedService;
    }

    public List<TopProviderDto> getTopProviders() {
        return topProviders;
    }
}
