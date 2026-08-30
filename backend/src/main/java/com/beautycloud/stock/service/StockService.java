package com.beautycloud.stock.service;

import com.beautycloud.company.entity.Company;
import com.beautycloud.company.repository.CompanyRepository;
import com.beautycloud.stock.dto.StockItemResponse;
import com.beautycloud.stock.entity.StockAvailability;
import com.beautycloud.stock.entity.StockItem;
import com.beautycloud.stock.entity.StockUnit;
import com.beautycloud.stock.repository.StockRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;
    private final CompanyRepository companyRepository;


    // =========================================================
    // GET BY COMPANY
    // =========================================================

    @Transactional(readOnly = true)
    public List<StockItemResponse> getByCompany(Long companyId) {

        return stockRepository
                .findByCompanyId(companyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public StockItemResponse getById(Long id) {

        StockItem item =
                stockRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Stock item not found"
                                )
                        );

        return toResponse(item);
    }


    // =========================================================
    // CREATE
    // =========================================================

    @Transactional
    public StockItemResponse create(
            Long companyId,
            String name,
            Double quantity,
            String unit,
            Double price,
            MultipartFile image
    ) {

        Company company =
                companyRepository.findById(companyId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Company not found"
                                )
                        );

        /*
         * Validate unit.
         *
         * Your StockItem entity stores unit as String,
         * so we convert the incoming value to String.
         */
        String normalizedUnit = parseUnit(unit);

        /*
         * StockItem uses Double.
         * Therefore we keep Double internally.
         */
        Double quantityValue =
                quantity == null
                        ? 0.0
                        : quantity;

        Double priceValue =
                price == null
                        ? 0.0
                        : price;

        /*
         * Determine availability.
         */
        StockAvailability availability =
                quantityValue > 0
                        ? StockAvailability.AVAILABLE
                        : StockAvailability.OUT_OF_STOCK;

        /*
         * Create stock item.
         */
        StockItem item =
                StockItem.builder()
                        .company(company)
                        .name(name)
                        .quantity(quantityValue)
                        .unit(normalizedUnit)
                        .price(priceValue)
                        .image(null)
                        .availability(availability)
                        .build();

        /*
         * Save.
         */
        StockItem saved =
                stockRepository.save(item);

        return toResponse(saved);
    }


    // =========================================================
    // UPDATE
    // =========================================================

    @Transactional
    public StockItemResponse update(
            Long id,
            Long companyId,
            String name,
            Double quantity,
            String unit,
            Double price,
            MultipartFile image
    ) {

        StockItem item =
                stockRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Stock item not found"
                                )
                        );

        Company company =
                companyRepository.findById(companyId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Company not found"
                                )
                        );

        String normalizedUnit =
                parseUnit(unit);

        Double quantityValue =
                quantity == null
                        ? 0.0
                        : quantity;

        Double priceValue =
                price == null
                        ? 0.0
                        : price;

        /*
         * Update fields.
         */
        item.setCompany(company);
        item.setName(name);
        item.setQuantity(quantityValue);
        item.setUnit(normalizedUnit);
        item.setPrice(priceValue);

        /*
         * Update availability automatically.
         */
        item.setAvailability(
                quantityValue > 0
                        ? StockAvailability.AVAILABLE
                        : StockAvailability.OUT_OF_STOCK
        );

        /*
         * Save.
         */
        StockItem updated =
                stockRepository.save(item);

        return toResponse(updated);
    }


    // =========================================================
    // DELETE
    // =========================================================

    @Transactional
    public void delete(Long id) {

        StockItem item =
                stockRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Stock item not found"
                                )
                        );

        /*
         * IMPORTANT:
         *
         * A stock item may be referenced by ServiceItem.
         *
         * If you try to delete a stock item that is already
         * used by a service, PostgreSQL may reject the delete
         * because of the foreign key constraint.
         *
         * We therefore check this relationship first.
         */

        if (
                item.getServiceItems() != null
                &&
                !item.getServiceItems().isEmpty()
        ) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete this stock item because it is used by one or more services"
            );
        }

        stockRepository.delete(item);
    }


    // =========================================================
    // PARSE UNIT
    // =========================================================

    private String parseUnit(String unit) {

        if (unit == null || unit.isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stock unit is required"
            );
        }

        try {

            /*
             * Validate that the value exists in StockUnit.
             */
            StockUnit stockUnit =
                    StockUnit.valueOf(
                            unit.trim().toUpperCase()
                    );

            /*
             * Your entity stores String,
             * so return the enum name as String.
             */
            return stockUnit.name();

        } catch (IllegalArgumentException e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid stock unit: " + unit
            );
        }
    }


    // =========================================================
    // RESPONSE
    // =========================================================

    private StockItemResponse toResponse(
            StockItem item
    ) {

        /*
         * Convert Double -> BigDecimal
         * because StockItemResponse uses BigDecimal.
         */
        BigDecimal quantity =
                item.getQuantity() == null
                        ? BigDecimal.ZERO
                        : BigDecimal.valueOf(
                                item.getQuantity()
                        );

        /*
         * Convert Double -> BigDecimal.
         */
        BigDecimal price =
                item.getPrice() == null
                        ? BigDecimal.ZERO
                        : BigDecimal.valueOf(
                                item.getPrice()
                        );

        return StockItemResponse.builder()
                .id(item.getId())

                .companyId(
                        item.getCompany() != null
                                ? item.getCompany().getId()
                                : null
                )

                .name(item.getName())

                .quantity(quantity)

                /*
                 * Entity stores String,
                 * response also expects String.
                 */
                .unit(item.getUnit())

                .price(price)

                .image(item.getImage())

                .availability(
                        item.getAvailability()
                )

                .build();
    }
}