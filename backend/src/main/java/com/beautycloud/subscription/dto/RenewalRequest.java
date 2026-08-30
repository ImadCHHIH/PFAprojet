package com.beautycloud.subscription.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RenewalRequest {

    @NotNull
    private Long planId;

    @NotNull
    private Integer durationMonths;

}