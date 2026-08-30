package com.beautycloud.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyLoginResponse {

    private Long id;

    private String name;

    private String email;

    private String logo;

    private String status;
}