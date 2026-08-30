package com.beautycloud.service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServiceItemRequest {

    private Long stockItemId;

    private BigDecimal quantityUsed;
}