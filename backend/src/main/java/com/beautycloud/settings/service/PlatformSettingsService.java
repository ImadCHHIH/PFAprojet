package com.beautycloud.settings.service;

import com.beautycloud.settings.dto.ThemeRequest;
import com.beautycloud.settings.dto.ThemeResponse;
import com.beautycloud.settings.entity.PlatformSettings;
import com.beautycloud.settings.repository.PlatformSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.beautycloud.settings.dto.*;

@Service
@RequiredArgsConstructor
@Transactional
public class PlatformSettingsService {

    private final PlatformSettingsRepository repository;
    

    /**
     * Always returns the single settings row.
     * Creates it if it doesn't exist.
     */
    private PlatformSettings getSettings() {
        return repository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    PlatformSettings settings = new PlatformSettings();
                    return repository.save(settings);
                });
    }

    public ThemeResponse getTheme() {
        PlatformSettings settings = getSettings();

        return ThemeResponse.builder()
                .theme(settings.getTheme())
                .build();
    }

    public ThemeResponse updateTheme(ThemeRequest request) {

        PlatformSettings settings = getSettings();

        settings.setTheme(request.getTheme());

        repository.save(settings);

        return ThemeResponse.builder()
                .theme(settings.getTheme())
                .build();
    }
    public LanguageResponse getLanguage() {

        PlatformSettings settings = getSettings();

        return LanguageResponse.builder()
                .language(settings.getLanguage())
                .build();

    }

    public LanguageResponse updateLanguage(LanguageRequest request) {

        PlatformSettings settings = getSettings();

        settings.setLanguage(request.getLanguage());

        repository.save(settings);

        return LanguageResponse.builder()
                .language(settings.getLanguage())
                .build();

    }
    public SettingsResponse getAllSettings() {

        PlatformSettings settings = getSettings();

        return SettingsResponse.builder()
                .theme(settings.getTheme())
                .language(settings.getLanguage())
                .dateFormat(settings.getDateFormat())
                .numberFormat(settings.getNumberFormat())
                .currency(settings.getCurrency())
                .build();
    }

    public DateFormatResponse getDateFormat() {

        PlatformSettings settings = getSettings();

        return DateFormatResponse.builder()
                .dateFormat(settings.getDateFormat())
                .build();

    }

    public DateFormatResponse updateDateFormat(
            DateFormatRequest request) {

        PlatformSettings settings = getSettings();

        settings.setDateFormat(request.getDateFormat());

        repository.save(settings);

        return DateFormatResponse.builder()
                .dateFormat(settings.getDateFormat())
                .build();

    }


    public NumberFormatResponse getNumberFormat() {

        PlatformSettings settings = getSettings();

        return NumberFormatResponse.builder()
                .numberFormat(settings.getNumberFormat())
                .build();

    }

    public NumberFormatResponse updateNumberFormat(
            NumberFormatRequest request) {

        PlatformSettings settings = getSettings();

        settings.setNumberFormat(request.getNumberFormat());

        repository.save(settings);

        return NumberFormatResponse.builder()
                .numberFormat(settings.getNumberFormat())
                .build();

    }


    public CurrencyResponse getCurrency() {

        PlatformSettings settings = getSettings();

        return CurrencyResponse.builder()
                .currency(settings.getCurrency())
                .build();

    }

    public CurrencyResponse updateCurrency(
            CurrencyRequest request) {

        PlatformSettings settings = getSettings();

        settings.setCurrency(request.getCurrency());

        repository.save(settings);

        return CurrencyResponse.builder()
                .currency(settings.getCurrency())
                .build();

    }

}