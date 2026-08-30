package com.beautycloud.dashboard.service;

import com.beautycloud.company.dto.CompanyResponse;
import com.beautycloud.company.entity.Company;
import com.beautycloud.company.repository.CompanyRepository;
import com.beautycloud.dashboard.dto.DashboardResponse;
import com.beautycloud.subscription.entity.Subscription;
import com.beautycloud.subscription.entity.SubscriptionStatus;
import com.beautycloud.subscription.repository.SubscriptionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CompanyRepository companyRepository;

    private final SubscriptionRepository subscriptionRepository;


    public DashboardResponse getDashboard() {

        long companies = companyRepository.count();


        long subscriptions = subscriptionRepository.count();


        long activeSubscriptions =
                subscriptionRepository.countByStatus(
                        SubscriptionStatus.ACTIVE
                );


        long expiredSubscriptions =
                subscriptionRepository.countByStatus(
                        SubscriptionStatus.EXPIRED
                );


        long canceledSubscriptions =
                subscriptionRepository.countByStatus(
                        SubscriptionStatus.CANCELLED
                );


        double revenue = subscriptionRepository.findAll()
                .stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE)
                .mapToDouble(s ->
                        s.getPlan().getMonthlyPrice()
                        *
                        s.getDurationMonths()
                )
                .sum();



        List<CompanyResponse> latestCompanies =
                companyRepository.findTop5ByOrderByIdDesc()
                        .stream()
                        .map(this::toResponse)
                        .toList();



        return DashboardResponse.builder()

                .companies(companies)

                .subscriptions(subscriptions)

                .revenue(revenue)

                .activeSubscriptions(activeSubscriptions)

                .expiredSubscriptions(expiredSubscriptions)

                .canceledSubscriptions(canceledSubscriptions)

                .latestCompanies(latestCompanies)

                .build();

    }



    private CompanyResponse toResponse(Company company) {

        return CompanyResponse.builder()

                .id(company.getId())

                .name(company.getName())

                .email(company.getEmail())

                .phone(company.getPhone())

                .address(company.getAddress())

                .city(company.getCity())

                .country(company.getCountry())

                .status(company.getStatus())

                .build();

    }

}