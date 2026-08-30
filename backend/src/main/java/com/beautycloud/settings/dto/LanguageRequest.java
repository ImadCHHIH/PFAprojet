package com.beautycloud.settings.dto;

import com.beautycloud.settings.entity.Language;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageRequest {

    private Language language;

}