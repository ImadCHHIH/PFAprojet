package com.beautycloud.settings.dto;

import com.beautycloud.settings.entity.Theme;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ThemeResponse {

    private Theme theme;

}