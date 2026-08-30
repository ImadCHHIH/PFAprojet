package com.beautycloud.plan.service;

import com.beautycloud.plan.dto.PlanRequest;
import com.beautycloud.plan.dto.PlanResponse;
import com.beautycloud.plan.entity.SubscriptionPlan;
import com.beautycloud.plan.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    public List<PlanResponse> getAllPlans() {

        return planRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

    }

    public PlanResponse createPlan(PlanRequest request) {

        SubscriptionPlan plan = SubscriptionPlan.builder()
                .name(request.getName())
                .type(request.getType())
                .monthlyPrice(request.getMonthlyPrice())
                .maxEmployees(request.getMaxEmployees())
                .maxServices(request.getMaxServices())
                .maxAppointmentsPerMonth(request.getMaxAppointmentsPerMonth())
                .active(true)
                .build();

        return toResponse(planRepository.save(plan));

    }

    public PlanResponse getPlanById(Long id) {

        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        return toResponse(plan);

    }

    public PlanResponse updatePlan(Long id, PlanRequest request) {

        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        plan.setName(request.getName());
        plan.setType(request.getType());
        plan.setMonthlyPrice(request.getMonthlyPrice());
        plan.setMaxEmployees(request.getMaxEmployees());
        plan.setMaxServices(request.getMaxServices());
        plan.setMaxAppointmentsPerMonth(request.getMaxAppointmentsPerMonth());

        return toResponse(planRepository.save(plan));

    }

    public void deletePlan(Long id) {

        planRepository.deleteById(id);

    }

    private PlanResponse toResponse(SubscriptionPlan plan) {

        return PlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .type(plan.getType())
                .monthlyPrice(plan.getMonthlyPrice())
                .maxEmployees(plan.getMaxEmployees())
                .maxServices(plan.getMaxServices())
                .maxAppointmentsPerMonth(plan.getMaxAppointmentsPerMonth())
                .active(plan.getActive())
                .build();

    }

}