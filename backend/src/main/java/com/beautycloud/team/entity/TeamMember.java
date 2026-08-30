package com.beautycloud.team.entity;

import com.beautycloud.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "team_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal salary;

    @Column
    private String picture;

    @Enumerated(EnumType.STRING)
    @Column(name = "duty_status", nullable = false)
    @Builder.Default
    private DutyStatus dutyStatus = DutyStatus.ON_DUTY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TeamAvailability availability = TeamAvailability.FREE;

    @Column(name = "appointment_count", nullable = false)
    @Builder.Default
    private Integer appointmentCount = 0;
}