package com.beautycloud.service.controller;

import com.beautycloud.service.dto.ServiceRequest;
import com.beautycloud.service.dto.ServiceResponse;
import com.beautycloud.service.service.ServiceService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;


    @PostMapping
    public ResponseEntity<ServiceResponse> create(
            @RequestBody ServiceRequest request
    ) {

        return ResponseEntity.ok(
                serviceService.create(request)
        );
    }


    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<ServiceResponse>> getByCompany(
            @PathVariable Long companyId
    ) {

        return ResponseEntity.ok(
                serviceService.getByCompany(companyId)
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                serviceService.getById(id)
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponse> update(
            @PathVariable Long id,
            @RequestBody ServiceRequest request
    ) {

        return ResponseEntity.ok(
                serviceService.update(id, request)
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        serviceService.delete(id);

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{id}/availability")
    public ResponseEntity<Boolean> availability(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                serviceService.isAvailable(id)
        );
    }
}