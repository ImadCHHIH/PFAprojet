package com.beautycloud.service.dto;

import lombok.Data;

import java.util.List;

@Data
public class ServiceRequest {

    private Long companyId;

    private String name;

    private Integer duration;

    private String description;

    private Double workerFee;

    private Double extraFee;

    private List<ServiceItemRequest> items;
}