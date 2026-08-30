package com.beautycloud.settings.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "platform_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================
    // THEME
    // =========================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Theme theme = Theme.LIGHT;


    // =========================
    // LANGUAGE
    // =========================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Language language = Language.ENGLISH;


    // =========================
    // DATE FORMAT
    // =========================

    @Column(name = "date_format", nullable = false)
    @Builder.Default
    private String dateFormat = "DD/MM/YYYY";


    // =========================
    // NUMBER FORMAT
    // =========================

    @Column(name = "number_format", nullable = false)
    @Builder.Default
    private String numberFormat = "1 234,56";


    // =========================
    // CURRENCY
    // =========================

    @Column(nullable = false)
    @Builder.Default
    private String currency = "MAD";

}

