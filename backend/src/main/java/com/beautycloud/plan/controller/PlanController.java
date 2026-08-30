package com.beautycloud.plan.controller;

import com.beautycloud.plan.dto.PlanRequest;
import com.beautycloud.plan.dto.PlanResponse;
import com.beautycloud.plan.service.PlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    @GetMapping
    public List<PlanResponse> getAllPlans() {

        return planService.getAllPlans();

    }

    @GetMapping("/{id}")
    public PlanResponse getPlanById(@PathVariable Long id) {

        return planService.getPlanById(id);

    }

    @PostMapping
    public PlanResponse createPlan(
            @Valid @RequestBody PlanRequest request) {

        return planService.createPlan(request);

    }

    @PutMapping("/{id}")
    public PlanResponse updatePlan(
            @PathVariable Long id,
            @Valid @RequestBody PlanRequest request) {

        return planService.updatePlan(id, request);

    }

    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable Long id) {

        planService.deletePlan(id);

    }

}