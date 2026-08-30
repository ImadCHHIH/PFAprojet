package com.beautycloud.subscription.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.beautycloud.subscription.entity.Subscription;
import com.beautycloud.subscription.entity.SubscriptionStatus;
import com.beautycloud.subscription.repository.SubscriptionRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubscriptionExpirationScheduler {

    private final SubscriptionRepository subscriptionRepository;

    // Runs every minute (for testing)
    @Scheduled(fixedRate = 60000)
    public void expireSubscriptions() {

        System.out.println("Checking expired subscriptions...");

        List<Subscription> subscriptions = subscriptionRepository.findAll();

        LocalDate today = LocalDate.now();

        for (Subscription subscription : subscriptions) {

            if (subscription.getStatus() == SubscriptionStatus.ACTIVE
                    && subscription.getEndDate().isBefore(today)) {

                subscription.setStatus(SubscriptionStatus.EXPIRED);

                subscriptionRepository.save(subscription);

                System.out.println(
                        "Subscription " + subscription.getId() + " expired.");
            }
        }
    }
}