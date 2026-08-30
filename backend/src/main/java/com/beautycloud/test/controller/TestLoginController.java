package com.beautycloud.test.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestLoginController {

    @GetMapping("/test")
    public String testLogin() {
        return "LOGIN SYSTEM IS REACHABLE";
    }
}