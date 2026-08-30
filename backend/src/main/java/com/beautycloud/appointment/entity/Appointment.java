package com.beautycloud.appointment.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // COMPANY
    // =========================================================

    @Column(nullable = false)
    private Long companyId;

    // =========================================================
    // CLIENT
    // =========================================================

    @Column(nullable = false)
    private String clientName;

    // =========================================================
    // SERVICE
    // =========================================================

    @Column(nullable = false)
    private Long serviceId;

    @Column(nullable = false)
    private String serviceName;

    // =========================================================
    // TEAM MEMBER
    // =========================================================

    @Column(nullable = false)
    private Long teamMemberId;

    @Column(nullable = false)
    private String teamMemberName;

    // =========================================================
    // DATE / TIME
    // =========================================================

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private LocalTime appointmentTime;

    // =========================================================
    // STATUS
    // =========================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    // =========================================================
    // PRICE
    // =========================================================

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal finalPrice;

    // =========================================================
    // PROMO
    // =========================================================

    private Long promoCodeId;

    private String promoCode;

    @Column(precision = 5, scale = 2)
    private BigDecimal promoDiscountPercentage;

    // =========================================================
    // COMPLETION PROCESSING
    // =========================================================

    /*
     * Prevents stock from being deducted twice if the appointment
     * is marked COMPLETED more than once.
     */
    @Column(nullable = false)
    private boolean stockDeducted = false;

    /*
     * Prevents appointmentCount from being incremented twice.
     */
    @Column(nullable = false)
    private boolean appointmentCountIncremented = false;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public Appointment() {
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

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Long getTeamMemberId() {
        return teamMemberId;
    }

    public void setTeamMemberId(Long teamMemberId) {
        this.teamMemberId = teamMemberId;
    }

    public String getTeamMemberName() {
        return teamMemberName;
    }

    public void setTeamMemberName(String teamMemberName) {
        this.teamMemberName = teamMemberName;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }

    public Long getPromoCodeId() {
        return promoCodeId;
    }

    public void setPromoCodeId(Long promoCodeId) {
        this.promoCodeId = promoCodeId;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }

    public BigDecimal getPromoDiscountPercentage() {
        return promoDiscountPercentage;
    }

    public void setPromoDiscountPercentage(
            BigDecimal promoDiscountPercentage
    ) {
        this.promoDiscountPercentage = promoDiscountPercentage;
    }

    public boolean isStockDeducted() {
        return stockDeducted;
    }

    public void setStockDeducted(boolean stockDeducted) {
        this.stockDeducted = stockDeducted;
    }

    public boolean isAppointmentCountIncremented() {
        return appointmentCountIncremented;
    }

    public void setAppointmentCountIncremented(
            boolean appointmentCountIncremented
    ) {
        this.appointmentCountIncremented =
                appointmentCountIncremented;
    }
}