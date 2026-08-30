package com.beautycloud.auth.controller;

import com.beautycloud.auth.dto.AuthenticationRequest;
import com.beautycloud.auth.dto.AuthenticationResponse;
import com.beautycloud.auth.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;


    // =========================================================
    // ADMIN LOGIN
    // =========================================================

    @PostMapping("/login")
    public AuthenticationResponse login(
            @RequestBody AuthenticationRequest request) {

        return authenticationService.login(request);
    }


    // =========================================================
    // SALON LOGIN
    // =========================================================

    @PostMapping("/salon/login")
    public AuthenticationResponse salonLogin(
            @RequestBody AuthenticationRequest request) {

        System.out.println("===== SALON LOGIN REACHED =====");
        System.out.println("EMAIL: " + request.getEmail());

        return authenticationService.salonLogin(request);
    }


    @GetMapping("/salon-test")
    public String salonTest() {

        return "SALON LOGIN SYSTEM IS REACHABLE";
    }
}

