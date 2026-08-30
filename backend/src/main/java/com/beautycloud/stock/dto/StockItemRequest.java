package com.beautycloud.stock.dto;

import java.math.BigDecimal;

import com.beautycloud.stock.entity.StockUnit;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockItemRequest {

    @NotNull
    private Long companyId;

    @NotBlank
    private String name;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal quantity;

    @NotNull
    private StockUnit unit;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal price;

    private String image;
}