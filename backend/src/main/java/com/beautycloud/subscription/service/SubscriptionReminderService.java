package com.beautycloud.subscription.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.beautycloud.notification.service.NotificationService;
import com.beautycloud.subscription.entity.Subscription;
import com.beautycloud.subscription.entity.SubscriptionStatus;
import com.beautycloud.subscription.repository.SubscriptionRepository;
import org.springframework.transaction.annotation.Transactional;
import com.beautycloud.email.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionReminderService {

    private final SubscriptionRepository subscriptionRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    @Scheduled(fixedRate = 10000) // Every 10 seconds (development)
    @Transactional
    public void checkSubscriptions() {

        LocalDate today = LocalDate.now();

        List<Subscription> subscriptions =
                subscriptionRepository.findAllWithCompanyOwnerAndPlan();
        for (Subscription subscription : subscriptions) {

            long days = ChronoUnit.DAYS.between(
                    today,
                    subscription.getEndDate()
            );

            System.out.println(
                    subscription.getCompany().getName()
                    + " | Status: " + subscription.getStatus()
                    + " | End: " + subscription.getEndDate()
                    + " | Days Left: " + days
            );

            // ================= ACTIVE =================

            if (subscription.getStatus() == SubscriptionStatus.ACTIVE) {

                if (days == 7 && !subscription.getReminder7Sent()) {

                	notificationService.create(
                	        "Subscription expires in 7 days",
                	        subscription.getCompany().getName()
                	                + " subscription expires in 7 days.",
                	        "SUBSCRIPTION"
                	);

                	if (subscription.getCompany().getOwner() != null) {

                	    emailService.sendSubscriptionExpiringEmail(

                	            subscription.getCompany()
                	                    .getOwner()
                	                    .getEmail(),

                	            subscription.getCompany()
                	                    .getName(),

                	            7

                	    );

                	}

                	subscription.setReminder7Sent(true);

                }

                if (days == 3 && !subscription.getReminder3Sent()) {

                	notificationService.create(
                	        "Subscription expires in 3 days",
                	        subscription.getCompany().getName()
                	                + " subscription expires in 3 days.",
                	        "SUBSCRIPTION"
                	);

                	if (subscription.getCompany().getOwner() != null) {

                	    emailService.sendSubscriptionExpiringEmail(

                	            subscription.getCompany()
                	                    .getOwner()
                	                    .getEmail(),

                	            subscription.getCompany()
                	                    .getName(),

                	            3

                	    );

                	}

                	subscription.setReminder3Sent(true);

                }

                if (days == 1 && !subscription.getReminder1Sent()) {

                	notificationService.create(
                	        "Subscription expires tomorrow",
                	        subscription.getCompany().getName()
                	                + " subscription expires tomorrow.",
                	        "SUBSCRIPTION"
                	);

                	if (subscription.getCompany().getOwner() != null) {

                	    emailService.sendSubscriptionExpiringEmail(

                	            subscription.getCompany()
                	                    .getOwner()
                	                    .getEmail(),

                	            subscription.getCompany()
                	                    .getName(),

                	            1

                	    );

                	}

                	subscription.setReminder1Sent(true);

                }

            }

         // ================= EXPIRED =================

            if (subscription.getStatus() == SubscriptionStatus.EXPIRED
                    && !subscription.getExpiredNotificationSent()) {

                notificationService.create(
                        "Subscription expired",
                        subscription.getCompany().getName()
                                + "'s subscription has expired.",
                        "SUBSCRIPTION"
                );

                if (subscription.getCompany().getOwner() != null) {

                    emailService.sendSubscriptionExpiredEmail(
                            subscription.getCompany()
                                    .getOwner()
                                    .getEmail(),
                            subscription.getCompany()
                                    .getName()
                    );

                }

                subscription.setExpiredNotificationSent(true);

            }
            subscriptionRepository.save(subscription);
        }
    }
}