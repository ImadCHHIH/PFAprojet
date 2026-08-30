package com.beautycloud.test.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salon/test")
public class TestSalonLoginController {

    @PostMapping("/login")
    public String login() {
        return "SALON LOGIN ENDPOINT WORKS";
    }
}