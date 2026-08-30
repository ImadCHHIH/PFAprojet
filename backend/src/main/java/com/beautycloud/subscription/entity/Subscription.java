package com.beautycloud.subscription.entity;

import java.time.LocalDate;

import com.beautycloud.company.entity.Company;
import com.beautycloud.plan.entity.SubscriptionPlan;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private SubscriptionPlan plan;

    @Column(nullable = false)
    private Integer durationMonths;

    private LocalDate startDate;

    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;
    @Column(nullable = false)
    @Builder.Default
    private Boolean reminder7Sent = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean reminder3Sent = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean reminder1Sent = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean expiredNotificationSent = false;

}