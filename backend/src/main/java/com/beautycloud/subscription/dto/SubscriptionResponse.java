package com.beautycloud.subscription.dto;

import java.time.LocalDate;

import com.beautycloud.subscription.entity.SubscriptionStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubscriptionResponse {

    private Long id;

    private Long companyId;
    private String company;

    private Long planId;
    private String plan;

    private Integer durationMonths;

    private LocalDate startDate;
    private LocalDate endDate;

    private SubscriptionStatus status;

}