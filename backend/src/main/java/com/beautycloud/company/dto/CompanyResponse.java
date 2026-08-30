package com.beautycloud.company.dto;

import com.beautycloud.company.entity.CompanyStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CompanyResponse {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private String address;

    private String city;

    private String country;

    private CompanyStatus status;

    private String logo;

    private Long ownerId;

    private String ownerName;

    private String ownerEmail;

    // =========================================================
    // SUBSCRIPTION INFORMATION
    // =========================================================

    private Long subscriptionId;

    private Long planId;

    private String plan;

    private Integer durationMonths;

    private LocalDate subscriptionStartDate;

    private LocalDate subscriptionEndDate;

    private String subscriptionStatus;
}