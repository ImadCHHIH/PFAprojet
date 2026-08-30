package com.beautycloud.subscription.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubscriptionRequest {

    @NotNull
    private Long companyId;

    @NotNull
    private Long planId;

    @NotNull
    @Min(1)
    private Integer durationMonths;

}