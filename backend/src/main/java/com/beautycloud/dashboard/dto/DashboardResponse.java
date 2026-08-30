package com.beautycloud.dashboard.dto;

import com.beautycloud.company.dto.CompanyResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private long companies;

    private long subscriptions;

    private double revenue;

    private long activeSubscriptions;

    private long expiredSubscriptions;

    private long canceledSubscriptions;

    private List<CompanyResponse> latestCompanies;

}