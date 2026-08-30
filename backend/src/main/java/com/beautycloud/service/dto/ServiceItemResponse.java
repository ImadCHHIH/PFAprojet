package com.beautycloud.service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ServiceItemResponse {

    private Long stockItemId;

    private String stockItemName;

    private String unit;

    private BigDecimal quantityUsed;

    private BigDecimal unitCost;

    private BigDecimal materialCost;
}