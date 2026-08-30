package com.beautycloud.promo.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
    name = "promo_codes",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {
                "companyId",
                "code"
            }
        )
    }
)
public class PromoCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // COMPANY
    // =========================================================

    @Column(nullable = false)
    private Long companyId;

    // =========================================================
    // PROMO INFORMATION
    // =========================================================

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String code;

    // =========================================================
    // DISCOUNT
    // =========================================================

    @Column(
        nullable = false,
        precision = 5,
        scale = 2
    )
    private BigDecimal discountPercentage;

    // =========================================================
    // VALIDITY
    // =========================================================

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    // =========================================================
    // ACTIVE
    // =========================================================

    @Column(nullable = false)
    private boolean active = true;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public PromoCode() {
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public BigDecimal getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(
            BigDecimal discountPercentage
    ) {
        this.discountPercentage =
                discountPercentage;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(
            LocalDate startDate
    ) {
        this.startDate =
                startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(
            LocalDate endDate
    ) {
        this.endDate =
                endDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}