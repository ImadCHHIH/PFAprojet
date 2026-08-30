package com.beautycloud.company.service;

import com.beautycloud.company.dto.CompanyRequest;
import com.beautycloud.company.dto.CompanyResponse;
import com.beautycloud.company.entity.Company;
import com.beautycloud.company.entity.CompanyStatus;
import com.beautycloud.company.repository.CompanyRepository;
import com.beautycloud.notification.service.NotificationService;
import com.beautycloud.user.entity.User;
import com.beautycloud.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.beautycloud.subscription.entity.Subscription;
import com.beautycloud.subscription.entity.SubscriptionStatus;
import com.beautycloud.subscription.repository.SubscriptionRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final SubscriptionRepository subscriptionRepository;

    // =========================================================
    // GET ALL COMPANIES
    // =========================================================

    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllCompanies() {

        return companyRepository.findAllWithOwner()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================================================
    // GET AVAILABLE COMPANIES
    // =========================================================

    @Transactional(readOnly = true)
    public List<CompanyResponse> getAvailableCompanies(Long ownerId) {

        List<Company> companies = new ArrayList<>();

        if (ownerId == null) {

            companies.addAll(
                    companyRepository.findByOwnerIsNull()
            );

        } else {

            User owner = userRepository.findById(ownerId)
                    .orElseThrow(() ->
                            new RuntimeException("Owner not found")
                    );

            companies.addAll(
                    companyRepository.findByOwnerIsNull()
            );

            companies.addAll(
                    companyRepository.findByOwnerWithOwner(owner)
            );
        }

        return companies.stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================================================
    // CREATE COMPANY
    // =========================================================

    @Transactional
    public CompanyResponse createCompany(CompanyRequest request) {

        User owner = null;

        if (request.getOwnerId() != null) {

            owner = userRepository.findById(request.getOwnerId())
                    .orElseThrow(() ->
                            new RuntimeException("Owner not found")
                    );
        }

        Company company = Company.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .country(request.getCountry())
                .status(CompanyStatus.ACTIVE)
                .logo(request.getLogo())
                .owner(owner)
                .build();

        company = companyRepository.save(company);

        notificationService.create(
                "New company",
                company.getName() + " joined BeautyCloud.",
                "COMPANY"
        );

        Company savedCompany =
                companyRepository.findByIdWithOwner(company.getId())
                        .orElseThrow(() ->
                                new RuntimeException("Company not found")
                        );

        return toResponse(savedCompany);
    }

    // =========================================================
    // GET COMPANY BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long id) {

        Company company = companyRepository.findByIdWithOwner(id)
                .orElseThrow(() ->
                        new RuntimeException("Company not found")
                );

        return toResponse(company);
    }

    // =========================================================
    // UPDATE COMPANY
    // =========================================================

    @Transactional
    public CompanyResponse updateCompany(
            Long id,
            CompanyRequest request) {

        Company company = companyRepository.findByIdWithOwner(id)
                .orElseThrow(() ->
                        new RuntimeException("Company not found")
                );

        User owner = null;

        if (request.getOwnerId() != null) {

            owner = userRepository.findById(request.getOwnerId())
                    .orElseThrow(() ->
                            new RuntimeException("Owner not found")
                    );
        }

        company.setName(request.getName());
        company.setEmail(request.getEmail());
        company.setPhone(request.getPhone());
        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setCountry(request.getCountry());
        company.setLogo(request.getLogo());
        company.setOwner(owner);

        companyRepository.save(company);

        notificationService.create(
                "Company updated",
                company.getName() + " information was updated.",
                "COMPANY"
        );

        Company updatedCompany =
                companyRepository.findByIdWithOwner(id)
                        .orElseThrow(() ->
                                new RuntimeException("Company not found")
                        );

        return toResponse(updatedCompany);
    }

    // =========================================================
    // TOGGLE STATUS
    // =========================================================

    @Transactional
    public CompanyResponse toggleStatus(Long id) {

        Company company = companyRepository.findByIdWithOwner(id)
                .orElseThrow(() ->
                        new RuntimeException("Company not found")
                );

        if (company.getStatus() == CompanyStatus.ACTIVE) {
            company.setStatus(CompanyStatus.SUSPENDED);
        } else {
            company.setStatus(CompanyStatus.ACTIVE);
        }

        companyRepository.save(company);

        notificationService.create(
                "Company status changed",
                company.getName() +
                        " is now " +
                        company.getStatus(),
                "COMPANY"
        );

        return toResponse(company);
    }

    // =========================================================
    // GET COMPANIES BY OWNER
    // =========================================================

    @Transactional(readOnly = true)
    public List<CompanyResponse> getCompaniesByOwner(User owner) {

        return companyRepository.findByOwnerWithOwner(owner)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================================================
    // ENTITY -> RESPONSE
    // =========================================================

    private CompanyResponse toResponse(Company company) {

        User owner = company.getOwner();

        Subscription subscription =
                subscriptionRepository
                        .findByCompanyIdAndStatus(
                                company.getId(),
                                SubscriptionStatus.ACTIVE
                        )
                        .orElse(null);

        return CompanyResponse.builder()

                // =====================================================
                // COMPANY
                // =====================================================

                .id(company.getId())
                .name(company.getName())
                .email(company.getEmail())
                .phone(company.getPhone())
                .address(company.getAddress())
                .city(company.getCity())
                .country(company.getCountry())
                .status(company.getStatus())
                .logo(company.getLogo())

                // =====================================================
                // OWNER
                // =====================================================

                .ownerId(
                        owner != null
                                ? owner.getId()
                                : null
                )

                .ownerName(
                        owner != null
                                ? owner.getFirstName()
                                    + " "
                                    + owner.getLastName()
                                : null
                )

                .ownerEmail(
                        owner != null
                                ? owner.getEmail()
                                : null
                )

                // =====================================================
                // SUBSCRIPTION
                // =====================================================

                .subscriptionId(
                        subscription != null
                                ? subscription.getId()
                                : null
                )

                .planId(
                        subscription != null &&
                        subscription.getPlan() != null
                                ? subscription.getPlan().getId()
                                : null
                )

                .plan(
                        subscription != null &&
                        subscription.getPlan() != null
                                ? subscription.getPlan().getName()
                                : null
                )

                .durationMonths(
                        subscription != null
                                ? subscription.getDurationMonths()
                                : null
                )

                .subscriptionStartDate(
                        subscription != null
                                ? subscription.getStartDate()
                                : null
                )

                .subscriptionEndDate(
                        subscription != null
                                ? subscription.getEndDate()
                                : null
                )

                .subscriptionStatus(
                        subscription != null &&
                        subscription.getStatus() != null
                                ? subscription.getStatus().name()
                                : null
                )

                .build();
    }
}