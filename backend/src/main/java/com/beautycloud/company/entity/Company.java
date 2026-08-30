package com.beautycloud.company.entity;

import com.beautycloud.common.entity.BaseEntity;
import com.beautycloud.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String address;

    private String city;

    private String country;

    @Enumerated(EnumType.STRING)
    private CompanyStatus status;

    @Column(columnDefinition = "TEXT")
    private String logo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;
}