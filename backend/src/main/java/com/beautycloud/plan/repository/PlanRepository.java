package com.beautycloud.plan.repository;

import com.beautycloud.plan.entity.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanRepository extends JpaRepository<SubscriptionPlan, Long> {
}