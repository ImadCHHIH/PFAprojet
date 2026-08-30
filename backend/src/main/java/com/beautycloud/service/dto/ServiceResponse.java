package com.beautycloud.service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ServiceResponse {

    private Long id;

    private Long companyId;

    private String name;

    private Integer duration;

    private String description;

    private Double workerFee;

    private Double extraFee;

    private BigDecimal materialCost;

    private BigDecimal totalPrice;

    private boolean available;

    private List<ServiceItemResponse> items;
}