package com.beautycloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BeautycloudApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeautycloudApiApplication.class, args);
    }

}