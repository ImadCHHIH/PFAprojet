package com.beautycloud.company.dto;

import com.beautycloud.company.entity.CompanyStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyRequest {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    private String phone;

    private String address;

    private String city;

    private String country;

    private CompanyStatus status;

    private String logo;

    private Long ownerId;

}