package com.beautycloud.plan.dto;

import com.beautycloud.plan.entity.PlanType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PlanRequest {

    @NotBlank
    private String name;

    @NotNull
    private PlanType type;

    @NotNull
    private Double monthlyPrice;

    @NotNull
    private Integer maxEmployees;

    @NotNull
    private Integer maxServices;

    @NotNull
    private Integer maxAppointmentsPerMonth;
}