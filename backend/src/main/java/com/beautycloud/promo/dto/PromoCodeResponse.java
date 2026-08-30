package com.beautycloud.promo.dto;

import com.beautycloud.promo.entity.PromoCode;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PromoCodeResponse {

    private Long id;

    private Long companyId;

    private String name;

    private String code;

    private BigDecimal discountPercentage;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean active;

    public static PromoCodeResponse fromEntity(
            PromoCode promo
    ) {

        PromoCodeResponse response =
                new PromoCodeResponse();

        response.id =
                promo.getId();

        response.companyId =
                promo.getCompanyId();

        response.name =
                promo.getName();

        response.code =
                promo.getCode();

        response.discountPercentage =
                promo.getDiscountPercentage();

        response.startDate =
                promo.getStartDate();

        response.endDate =
                promo.getEndDate();

        response.active =
                promo.isActive();

        return response;
    }

    public Long getId() {
        return id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public BigDecimal getDiscountPercentage() {
        return discountPercentage;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public boolean isActive() {
        return active;
    }
}