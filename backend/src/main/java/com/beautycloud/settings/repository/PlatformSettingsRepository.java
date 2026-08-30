package com.beautycloud.settings.repository;

import com.beautycloud.settings.entity.PlatformSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlatformSettingsRepository
        extends JpaRepository<PlatformSettings, Long> {
}