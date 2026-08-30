package com.beautycloud.company.controller;

import com.beautycloud.company.dto.CompanyRequest;
import com.beautycloud.company.dto.CompanyResponse;
import com.beautycloud.company.service.CompanyService;
import com.beautycloud.user.entity.User;
import com.beautycloud.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private final UserRepository userRepository;

    // =========================================================
    // GET MY COMPANIES
    // IMPORTANT: keep this BEFORE /{id}
    // =========================================================

    @GetMapping("/my-companies")
    public List<CompanyResponse> getMyCompanies(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return companyService.getCompaniesByOwner(user);
    }

    // =========================================================
    // GET ALL COMPANIES
    // =========================================================

    @GetMapping
    public List<CompanyResponse> getAllCompanies() {

        return companyService.getAllCompanies();
    }

    // =========================================================
    // GET AVAILABLE COMPANIES
    // =========================================================

    @GetMapping("/available")
    public List<CompanyResponse> getAvailableCompanies(
            @RequestParam(required = false) Long ownerId) {

        return companyService.getAvailableCompanies(ownerId);
    }

    // =========================================================
    // CREATE COMPANY
    // =========================================================

    @PostMapping
    public CompanyResponse createCompany(
            @Valid @RequestBody CompanyRequest request) {

        return companyService.createCompany(request);
    }

    // =========================================================
    // GET COMPANY BY ID
    // =========================================================

    @GetMapping("/{id}")
    public CompanyResponse getCompanyById(
            @PathVariable Long id) {

        return companyService.getCompanyById(id);
    }

    // =========================================================
    // UPDATE COMPANY
    // =========================================================

    @PutMapping("/{id}")
    public CompanyResponse updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody CompanyRequest request) {

        System.out.println("UPDATE COMPANY CALLED");

        return companyService.updateCompany(id, request);
    }

    // =========================================================
    // TOGGLE STATUS
    // =========================================================

    @PutMapping("/{id}/toggle-status")
    public CompanyResponse toggleStatus(
            @PathVariable Long id) {

        return companyService.toggleStatus(id);
    }
}