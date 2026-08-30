package com.beautycloud.team.dto;

import java.math.BigDecimal;

import com.beautycloud.team.entity.DutyStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TeamMemberRequest {

    @NotNull
    private Long companyId;

    @NotBlank
    private String name;

    @NotBlank
    private String role;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phone;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal salary;

    private DutyStatus dutyStatus;

    private String picture;
}