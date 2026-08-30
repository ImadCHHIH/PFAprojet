package com.beautycloud.settings.dto;

import com.beautycloud.settings.entity.Language;
import com.beautycloud.settings.entity.Theme;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SettingsResponse {

    private Theme theme;
    private Language language;
    private String dateFormat;
    private String numberFormat;
    private String currency;
}

