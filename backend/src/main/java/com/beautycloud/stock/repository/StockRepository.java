package com.beautycloud.stock.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.beautycloud.stock.entity.StockItem;

public interface StockRepository
        extends JpaRepository<StockItem, Long> {

    List<StockItem> findByCompanyId(Long companyId);

}