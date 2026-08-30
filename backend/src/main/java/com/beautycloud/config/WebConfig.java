package com.beautycloud.config;

import org.springframework.context.annotation.Configuration;

import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {

        registry
            .addResourceHandler("/logos/**")
            .addResourceLocations("file:uploads/logos/");

        registry
            .addResourceHandler("/profiles/**")
            .addResourceLocations("file:uploads/profiles/");

        registry
            .addResourceHandler("/uploads/**")
            .addResourceLocations("file:uploads/");
    }
}