package com.beautycloud.plan.dto;

import com.beautycloud.plan.entity.PlanType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlanResponse {

    private Long id;
    private String name;
    private PlanType type;
    private Double monthlyPrice;
    private Integer maxEmployees;
    private Integer maxServices;
    private Integer maxAppointmentsPerMonth;
    private Boolean active;

}