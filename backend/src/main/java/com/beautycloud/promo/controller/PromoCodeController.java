package com.beautycloud.promo.controller;

import com.beautycloud.promo.dto.PromoCodeRequest;
import com.beautycloud.promo.dto.PromoCodeResponse;
import com.beautycloud.promo.service.PromoCodeService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promo-codes")
@RequiredArgsConstructor
@CrossOrigin
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<PromoCodeResponse>>
    getByCompany(
            @PathVariable Long companyId
    ) {

        return ResponseEntity.ok(
                promoCodeService
                        .getByCompany(companyId)
        );
    }

    // =========================================================
    // GET ONE
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<PromoCodeResponse>
    getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                promoCodeService.getById(id)
        );
    }

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<PromoCodeResponse>
    create(
            @Valid
            @RequestBody
            PromoCodeRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        promoCodeService
                                .create(request)
                );
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<PromoCodeResponse>
    update(
            @PathVariable Long id,

            @Valid
            @RequestBody
            PromoCodeRequest request
    ) {

        return ResponseEntity.ok(
                promoCodeService
                        .update(
                                id,
                                request
                        )
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    delete(
            @PathVariable Long id
    ) {

        promoCodeService.delete(id);

        return ResponseEntity.noContent()
                .build();
    }
}