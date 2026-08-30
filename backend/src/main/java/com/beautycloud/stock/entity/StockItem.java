package com.beautycloud.stock.entity;

import com.beautycloud.company.entity.Company;
import com.beautycloud.service.entity.ServiceItem;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "company_id",
            nullable = false
    )
    private Company company;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private Double price;

    @Column
    private String image;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StockAvailability availability;

    @OneToMany(
            mappedBy = "stockItem",
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<ServiceItem> serviceItems = new ArrayList<>();
}