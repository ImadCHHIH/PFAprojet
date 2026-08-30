package com.beautycloud.subscription.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.beautycloud.subscription.entity.Subscription;
import com.beautycloud.subscription.entity.SubscriptionStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    boolean existsByCompanyIdAndStatus(
            Long companyId,
            SubscriptionStatus status
    );

    long countByStatus(
            SubscriptionStatus status
    );

    List<Subscription> findByEndDate(LocalDate endDate);

    List<Subscription> findByStatus(SubscriptionStatus status);

    Optional<Subscription> findByCompanyIdAndStatus(
            Long companyId,
            SubscriptionStatus status
    );

    @Query("""
        SELECT s
        FROM Subscription s
        JOIN FETCH s.company c
        LEFT JOIN FETCH c.owner
        LEFT JOIN FETCH s.plan
    """)
    List<Subscription> findAllWithCompanyOwnerAndPlan();

    @Query("""
        SELECT s
        FROM Subscription s
        JOIN FETCH s.company c
        LEFT JOIN FETCH c.owner
        LEFT JOIN FETCH s.plan
        WHERE s.id = :id
    """)
    Optional<Subscription> findByIdWithCompanyOwnerAndPlan(Long id);
}