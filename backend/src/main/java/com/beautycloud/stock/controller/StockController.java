package com.beautycloud.stock.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.beautycloud.stock.dto.StockItemResponse;
import com.beautycloud.stock.service.StockService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/company/{companyId}")
    public List<StockItemResponse> getCompanyStock(
            @PathVariable Long companyId
    ) {

        return stockService.getByCompany(companyId);
    }

    @GetMapping("/{id}")
    public StockItemResponse getById(
            @PathVariable Long id
    ) {

        return stockService.getById(id);
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public StockItemResponse create(

            @RequestParam Long companyId,

            @RequestParam String name,

            @RequestParam Double quantity,

            @RequestParam String unit,

            @RequestParam Double price,

            @RequestParam(required = false)
            MultipartFile image

    ) {

        return stockService.create(
                companyId,
                name,
                quantity,
                unit,
                price,
                image
        );
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public StockItemResponse update(

            @PathVariable Long id,

            @RequestParam Long companyId,

            @RequestParam String name,

            @RequestParam Double quantity,

            @RequestParam String unit,

            @RequestParam Double price,

            @RequestParam(required = false)
            MultipartFile image

    ) {

        return stockService.update(
                id,
                companyId,
                name,
                quantity,
                unit,
                price,
                image
        );
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        stockService.delete(id);
    }
}