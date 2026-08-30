package com.beautycloud.appointment.dto;

import com.beautycloud.appointment.entity.Appointment;
import com.beautycloud.appointment.entity.AppointmentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentResponse {

    private Long id;

    private Long companyId;

    private String clientName;

    private Long serviceId;

    private String serviceName;

    private Long teamMemberId;

    private String teamMemberName;

    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    private AppointmentStatus status;

    private BigDecimal originalPrice;

    private BigDecimal discountAmount;

    private BigDecimal finalPrice;

    private Long promoCodeId;

    private String promoCode;

    private BigDecimal promoDiscountPercentage;

    public static AppointmentResponse fromEntity(
            Appointment appointment
    ) {

        AppointmentResponse response =
                new AppointmentResponse();

        response.id =
                appointment.getId();

        response.companyId =
                appointment.getCompanyId();

        response.clientName =
                appointment.getClientName();

        response.serviceId =
                appointment.getServiceId();

        response.serviceName =
                appointment.getServiceName();

        response.teamMemberId =
                appointment.getTeamMemberId();

        response.teamMemberName =
                appointment.getTeamMemberName();

        response.appointmentDate =
                appointment.getAppointmentDate();

        response.appointmentTime =
                appointment.getAppointmentTime();

        response.status =
                appointment.getStatus();

        response.originalPrice =
                appointment.getOriginalPrice();

        response.discountAmount =
                appointment.getDiscountAmount();

        response.finalPrice =
                appointment.getFinalPrice();

        response.promoCodeId =
                appointment.getPromoCodeId();

        response.promoCode =
                appointment.getPromoCode();

        response.promoDiscountPercentage =
                appointment.getPromoDiscountPercentage();

        return response;
    }

    public Long getId() {
        return id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public String getClientName() {
        return clientName;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public Long getTeamMemberId() {
        return teamMemberId;
    }

    public String getTeamMemberName() {
        return teamMemberName;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public Long getPromoCodeId() {
        return promoCodeId;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public BigDecimal getPromoDiscountPercentage() {
        return promoDiscountPercentage;
    }
}