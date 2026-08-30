package com.beautycloud.stock.dto;

import java.math.BigDecimal;

import com.beautycloud.stock.entity.StockAvailability;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockItemResponse {

    private Long id;

    private Long companyId;

    private String name;

    private BigDecimal quantity;

    private String unit;

    private BigDecimal price;

    private String image;

    private StockAvailability availability;
}