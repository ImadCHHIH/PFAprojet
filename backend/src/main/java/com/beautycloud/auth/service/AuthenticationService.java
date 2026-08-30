package com.beautycloud.auth.service;

import com.beautycloud.auth.dto.AuthenticationRequest;
import com.beautycloud.auth.dto.AuthenticationResponse;
import com.beautycloud.auth.dto.CompanyLoginResponse;
import com.beautycloud.auth.dto.UserLoginResponse;
import com.beautycloud.company.repository.CompanyRepository;
import com.beautycloud.role.entity.RoleType;
import com.beautycloud.user.entity.User;
import com.beautycloud.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final UserRepository userRepository;

    private final CompanyRepository companyRepository;


    // =========================================================
    // ADMIN LOGIN
    // =========================================================

    public AuthenticationResponse login(
            AuthenticationRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found"
                        )
                );


        // Only SUPER_ADMIN can use /auth/login

        if (user.getRole() == null ||
                user.getRole().getName() != RoleType.SUPER_ADMIN) {

            throw new BadCredentialsException(
                    "This account is not authorized for admin login."
            );
        }


        String token =
                jwtService.generateToken(user.getEmail());


        return AuthenticationResponse.builder()

                .token(token)

                .user(
                        UserLoginResponse.builder()

                                .id(user.getId())

                                .firstName(
                                        user.getFirstName()
                                )

                                .lastName(
                                        user.getLastName()
                                )

                                .email(
                                        user.getEmail()
                                )

                                .role(
                                        user.getRole()
                                                .getName()
                                                .name()
                                )

                                .mustChangePassword(
                                        user.getMustChangePassword()
                                )

                                // Admin does not need companies
                                .companies(List.of())

                                .build()
                )

                .build();
    }


    // =========================================================
    // SALON LOGIN
    // =========================================================

    public AuthenticationResponse salonLogin(
            AuthenticationRequest request) {


        // 1. Find USER using user's email

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Invalid email or password"
                        )
                );


        // 2. Only SALON_ADMIN can use /auth/salon/login

        if (user.getRole() == null ||
                user.getRole().getName() != RoleType.SALON_ADMIN) {

            throw new BadCredentialsException(
                    "This account is not a salon administrator."
            );
        }


        // 3. Authenticate USER email + USER password

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );


        // 4. Get ALL companies owned by this user

        List<CompanyLoginResponse> companies =
                companyRepository
                        .findByOwner(user)
                        .stream()
                        .map(company ->
                                CompanyLoginResponse.builder()

                                        .id(company.getId())

                                        .name(company.getName())

                                        .email(company.getEmail())

                                        .logo(company.getLogo())

                                        .status(
                                                company.getStatus() != null
                                                        ? company.getStatus()
                                                                .name()
                                                        : null
                                        )

                                        .build()
                        )
                        .toList();


        // 5. Generate salon JWT

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );


        // 6. Return USER + all owned companies

        return AuthenticationResponse.builder()

                .token(token)

                .user(
                        UserLoginResponse.builder()

                                .id(user.getId())

                                .firstName(
                                        user.getFirstName()
                                )

                                .lastName(
                                        user.getLastName()
                                )

                                .email(
                                        user.getEmail()
                                )

                                .role(
                                        user.getRole()
                                                .getName()
                                                .name()
                                )

                                .mustChangePassword(
                                        user.getMustChangePassword()
                                )

                                .companies(companies)

                                .build()
                )

                .build();
    }
}