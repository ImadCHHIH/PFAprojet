package com.beautycloud.settings.controller;

import com.beautycloud.settings.dto.*;
import com.beautycloud.settings.service.PlatformSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class PlatformSettingsController {

    private final PlatformSettingsService platformSettingsService;
    @GetMapping
    public SettingsResponse getAllSettings() {

        return platformSettingsService.getAllSettings();

    }


    // =========================
    // THEME
    // =========================

    @GetMapping("/theme")
    public ThemeResponse getTheme() {

        return platformSettingsService.getTheme();

    }

    @PutMapping("/theme")
    @ResponseStatus(HttpStatus.OK)
    public ThemeResponse updateTheme(
            @RequestBody ThemeRequest request) {

        return platformSettingsService.updateTheme(request);

    }


    // =========================
    // LANGUAGE
    // =========================

    @GetMapping("/language")
    public LanguageResponse getLanguage() {

        return platformSettingsService.getLanguage();

    }

    @PutMapping("/language")
    @ResponseStatus(HttpStatus.OK)
    public LanguageResponse updateLanguage(
            @RequestBody LanguageRequest request) {

        return platformSettingsService.updateLanguage(request);

    }


    // =========================
    // DATE FORMAT
    // =========================

    @GetMapping("/date-format")
    public DateFormatResponse getDateFormat() {

        return platformSettingsService.getDateFormat();

    }

    @PutMapping("/date-format")
    @ResponseStatus(HttpStatus.OK)
    public DateFormatResponse updateDateFormat(
            @RequestBody DateFormatRequest request) {

        return platformSettingsService.updateDateFormat(request);

    }


    // =========================
    // NUMBER FORMAT
    // =========================

    @GetMapping("/number-format")
    public NumberFormatResponse getNumberFormat() {

        return platformSettingsService.getNumberFormat();

    }

    @PutMapping("/number-format")
    @ResponseStatus(HttpStatus.OK)
    public NumberFormatResponse updateNumberFormat(
            @RequestBody NumberFormatRequest request) {

        return platformSettingsService.updateNumberFormat(request);

    }


    // =========================
    // CURRENCY
    // =========================

    @GetMapping("/currency")
    public CurrencyResponse getCurrency() {

        return platformSettingsService.getCurrency();

    }

    @PutMapping("/currency")
    @ResponseStatus(HttpStatus.OK)
    public CurrencyResponse updateCurrency(
            @RequestBody CurrencyRequest request) {

        return platformSettingsService.updateCurrency(request);

    }

}

