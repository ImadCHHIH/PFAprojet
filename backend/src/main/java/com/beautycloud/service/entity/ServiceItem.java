package com.beautycloud.service.entity;

import com.beautycloud.stock.entity.StockItem;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "service_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "service_id",
            nullable = false
    )
    private Service service;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "stock_item_id",
            nullable = false
    )
    private StockItem stockItem;

    @Column(
            name = "quantity_used",
            nullable = false,
            precision = 15,
            scale = 4
    )
    private BigDecimal quantityUsed;
}