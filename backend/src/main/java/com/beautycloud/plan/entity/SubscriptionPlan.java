package com.beautycloud.plan.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscription_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private PlanType type;

    private Double monthlyPrice;

    private Integer maxEmployees;

    private Integer maxServices;

    private Integer maxAppointmentsPerMonth;

    private Boolean active;

}