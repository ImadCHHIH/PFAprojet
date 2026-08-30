package com.beautycloud.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String role;

    private Boolean mustChangePassword;

    private List<CompanyLoginResponse> companies;}