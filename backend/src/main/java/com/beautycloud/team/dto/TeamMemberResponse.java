package com.beautycloud.team.dto;

import java.math.BigDecimal;

import com.beautycloud.team.entity.DutyStatus;
import com.beautycloud.team.entity.TeamAvailability;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamMemberResponse {

    private Long id;

    private Long companyId;

    private String name;

    private String role;

    private String email;

    private String phone;

    private BigDecimal salary;

    private String picture;

    private DutyStatus dutyStatus;

    private TeamAvailability availability;

    private Integer appointmentCount;
}