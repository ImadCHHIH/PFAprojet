package com.beautycloud.subscription.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.beautycloud.company.entity.Company;
import com.beautycloud.company.repository.CompanyRepository;
import com.beautycloud.notification.service.NotificationService;
import com.beautycloud.plan.entity.SubscriptionPlan;
import com.beautycloud.plan.repository.PlanRepository;
import com.beautycloud.subscription.dto.RenewalRequest;
import com.beautycloud.subscription.dto.SubscriptionRequest;
import com.beautycloud.subscription.dto.SubscriptionResponse;
import com.beautycloud.subscription.entity.Subscription;
import com.beautycloud.subscription.entity.SubscriptionStatus;
import com.beautycloud.subscription.repository.SubscriptionRepository;
import com.beautycloud.email.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final CompanyRepository companyRepository;
    private final PlanRepository planRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public List<SubscriptionResponse> getAll() {

        return subscriptionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

    }

    public SubscriptionResponse getById(Long id) {

        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Subscription not found"));

        return toResponse(subscription);

    }

    public SubscriptionResponse create(SubscriptionRequest request) {

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Company not found"));

        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Plan not found"));

        if (!List.of(1, 3, 6, 12).contains(request.getDurationMonths())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Duration must be 1, 3, 6 or 12 months.");
        }

        boolean hasActiveSubscription =
                subscriptionRepository.findAll()
                        .stream()
                        .anyMatch(s ->
                                s.getCompany().getId().equals(company.getId())
                                && s.getStatus() == SubscriptionStatus.ACTIVE);

        if (hasActiveSubscription) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This company already has an active subscription.");
        }

        Subscription subscription = Subscription.builder()
                .company(company)
                .plan(plan)
                .durationMonths(request.getDurationMonths())
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(request.getDurationMonths()))
                .status(SubscriptionStatus.ACTIVE)
                .build();

        subscription = subscriptionRepository.save(subscription);

        notificationService.create(
                "Subscription created",
                company.getName() + " subscribed to " + plan.getName() + ".",
                "SUBSCRIPTION"
        );

        return toResponse(subscription);

    }

    public SubscriptionResponse update(Long id, SubscriptionRequest request) {

        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Subscription not found"));

        if (subscription.getStatus() == SubscriptionStatus.CANCELLED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cancelled subscriptions cannot be updated.");
        }

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Company not found"));

        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Plan not found"));

        if (!List.of(1, 3, 6, 12).contains(request.getDurationMonths())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Duration must be 1, 3, 6 or 12 months.");
        }

        subscription.setCompany(company);
        subscription.setPlan(plan);
        subscription.setDurationMonths(request.getDurationMonths());
        subscription.setEndDate(
                subscription.getStartDate().plusMonths(request.getDurationMonths()));

        subscription = subscriptionRepository.save(subscription);

        notificationService.create(
                "Subscription updated",
                company.getName() + "'s subscription was updated.",
                "SUBSCRIPTION"
        );

        return toResponse(subscription);

    }

    public SubscriptionResponse renew(Long id, RenewalRequest request) {

        Subscription subscription = subscriptionRepository.findByIdWithCompanyOwnerAndPlan(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Subscription not found"));

        if (subscription.getStatus() == SubscriptionStatus.CANCELLED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cancelled subscriptions cannot be renewed.");
        }

        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Plan not found"));

        if (!List.of(1, 3, 6, 12).contains(request.getDurationMonths())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Duration must be 1, 3, 6 or 12 months.");
        }

        subscription.setPlan(plan);
        subscription.setDurationMonths(request.getDurationMonths());

        LocalDate today = LocalDate.now();

        if (subscription.getEndDate().isAfter(today)) {

            subscription.setEndDate(
                    subscription.getEndDate()
                            .plusMonths(request.getDurationMonths()));

        } else {

            subscription.setStartDate(today);

            subscription.setEndDate(
                    today.plusMonths(request.getDurationMonths()));

        }

        subscription.setStatus(SubscriptionStatus.ACTIVE);

        String ownerEmail = null;

        if (subscription.getCompany().getOwner() != null) {
            ownerEmail = subscription.getCompany().getOwner().getEmail();
        }

        subscription = subscriptionRepository.save(subscription);

        if (ownerEmail != null) {

            emailService.sendSubscriptionRenewedEmail(
                    ownerEmail,
                    subscription.getCompany().getName(),
                    subscription.getPlan().getName(),
                    subscription.getEndDate()
            );
        }

        notificationService.create(
                "Subscription renewed",
                subscription.getCompany().getName()
                        + " renewed for "
                        + request.getDurationMonths()
                        + " month(s).",
                "SUBSCRIPTION"
        );

        return toResponse(subscription);

    }

    public SubscriptionResponse cancel(Long id) {

        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Subscription not found"));

        if (subscription.getStatus() == SubscriptionStatus.CANCELLED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Subscription is already cancelled.");
        }

        subscription.setStatus(SubscriptionStatus.CANCELLED);

        subscription = subscriptionRepository.save(subscription);

        notificationService.create(
                "Subscription cancelled",
                subscription.getCompany().getName() + "'s subscription was cancelled.",
                "SUBSCRIPTION"
        );

        return toResponse(subscription);

    }

    private SubscriptionResponse toResponse(Subscription subscription) {

        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .companyId(subscription.getCompany().getId())
                .company(subscription.getCompany().getName())
                .planId(subscription.getPlan().getId())
                .plan(subscription.getPlan().getName())
                .durationMonths(subscription.getDurationMonths())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .status(subscription.getStatus())
                .build();

    }

}