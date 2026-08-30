package com.beautycloud.subscription.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.beautycloud.subscription.dto.SubscriptionRequest;
import com.beautycloud.subscription.dto.SubscriptionResponse;
import com.beautycloud.subscription.dto.RenewalRequest;
import com.beautycloud.subscription.service.SubscriptionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService service;

    @GetMapping
    public List<SubscriptionResponse> getAll() {

        return service.getAll();

    }

    @GetMapping("/{id}")
    public SubscriptionResponse getById(@PathVariable Long id) {

        return service.getById(id);

    }

    @PostMapping
    public SubscriptionResponse create(
            @Valid @RequestBody SubscriptionRequest request) {

        return service.create(request);

    }

    @PutMapping("/{id}")
    public SubscriptionResponse update(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionRequest request) {

        return service.update(id, request);

    }

    @PutMapping("/{id}/cancel")
    public SubscriptionResponse cancel(@PathVariable Long id) {

        return service.cancel(id);

    }
    @PutMapping("/{id}/renew")
    public SubscriptionResponse renew(
            @PathVariable Long id,
            @Valid @RequestBody RenewalRequest request) {
    	System.out.println("RENEW ENDPOINT CALLED");
        return service.renew(id, request);

    }

}