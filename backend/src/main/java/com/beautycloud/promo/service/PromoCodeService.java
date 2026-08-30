package com.beautycloud.promo.service;

import com.beautycloud.promo.dto.PromoCodeRequest;
import com.beautycloud.promo.dto.PromoCodeResponse;
import com.beautycloud.promo.entity.PromoCode;
import com.beautycloud.promo.repository.PromoCodeRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;

    // =========================================================
    // GET BY COMPANY
    // =========================================================

    public List<PromoCodeResponse> getByCompany(
            Long companyId
    ) {

        return promoCodeRepository
                .findByCompanyId(companyId)
                .stream()
                .map(PromoCodeResponse::fromEntity)
                .toList();
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public PromoCodeResponse getById(
            Long id
    ) {

        PromoCode promo =
                promoCodeRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Promo code not found."
                                )
                        );

        return PromoCodeResponse
                .fromEntity(promo);
    }

    // =========================================================
    // CREATE
    // =========================================================

    public PromoCodeResponse create(
            PromoCodeRequest request
    ) {

        validateDates(request);

        String code =
                request.getCode()
                        .trim()
                        .toUpperCase();

        if (
            promoCodeRepository
                .findByCompanyIdAndCode(
                    request.getCompanyId(),
                    code
                )
                .isPresent()
        ) {

            throw new RuntimeException(
                    "This promo code already exists."
            );
        }

        PromoCode promo =
                new PromoCode();

        promo.setCompanyId(
                request.getCompanyId()
        );

        promo.setName(
                request.getName().trim()
        );

        promo.setCode(code);

        promo.setDiscountPercentage(
                request.getDiscountPercentage()
        );

        promo.setStartDate(
                request.getStartDate()
        );

        promo.setEndDate(
                request.getEndDate()
        );

        promo.setActive(
                request.isActive()
        );

        return PromoCodeResponse.fromEntity(
                promoCodeRepository.save(promo)
        );
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public PromoCodeResponse update(
            Long id,
            PromoCodeRequest request
    ) {

        validateDates(request);

        PromoCode promo =
                promoCodeRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Promo code not found."
                                )
                        );

        String code =
                request.getCode()
                        .trim()
                        .toUpperCase();

        promoCodeRepository
                .findByCompanyIdAndCode(
                        request.getCompanyId(),
                        code
                )
                .ifPresent(existing -> {

                    if (
                        !existing.getId()
                                .equals(id)
                    ) {

                        throw new RuntimeException(
                                "This promo code already exists."
                        );
                    }
                });

        promo.setCompanyId(
                request.getCompanyId()
        );

        promo.setName(
                request.getName().trim()
        );

        promo.setCode(code);

        promo.setDiscountPercentage(
                request.getDiscountPercentage()
        );

        promo.setStartDate(
                request.getStartDate()
        );

        promo.setEndDate(
                request.getEndDate()
        );

        promo.setActive(
                request.isActive()
        );

        return PromoCodeResponse.fromEntity(
                promoCodeRepository.save(promo)
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    public void delete(Long id) {

        if (
            !promoCodeRepository
                .existsById(id)
        ) {

            throw new RuntimeException(
                    "Promo code not found."
            );
        }

        promoCodeRepository.deleteById(id);
    }

    // =========================================================
    // VALIDATE PROMO
    // =========================================================

    public PromoCode findValidPromo(
            Long companyId,
            Long promoCodeId,
            LocalDate appointmentDate
    ) {

        if (promoCodeId == null) {
            return null;
        }

        PromoCode promo =
                promoCodeRepository
                        .findById(promoCodeId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Promo code not found."
                                )
                        );

        if (
            !promo.getCompanyId()
                    .equals(companyId)
        ) {

            throw new RuntimeException(
                    "Promo code does not belong to this company."
            );
        }

        if (!promo.isActive()) {

            throw new RuntimeException(
                    "Promo code is inactive."
            );
        }

        if (
            appointmentDate.isBefore(
                    promo.getStartDate()
            )
        ) {

            throw new RuntimeException(
                    "Promo code is not active yet."
            );
        }

        if (
            appointmentDate.isAfter(
                    promo.getEndDate()
            )
        ) {

            throw new RuntimeException(
                    "Promo code has expired."
            );
        }

        return promo;
    }

    // =========================================================
    // VALIDATE DATES
    // =========================================================

    private void validateDates(
            PromoCodeRequest request
    ) {

        if (
            request.getStartDate()
                    .isAfter(
                            request.getEndDate()
                    )
        ) {

            throw new RuntimeException(
                    "Start date cannot be after end date."
            );
        }
    }
}