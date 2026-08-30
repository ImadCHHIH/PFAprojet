package com.beautycloud.promo.repository;

import com.beautycloud.promo.entity.PromoCode;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PromoCodeRepository
        extends JpaRepository<PromoCode, Long> {

    List<PromoCode> findByCompanyId(
            Long companyId
    );

    Optional<PromoCode> findByCompanyIdAndCode(
            Long companyId,
            String code
    );
}