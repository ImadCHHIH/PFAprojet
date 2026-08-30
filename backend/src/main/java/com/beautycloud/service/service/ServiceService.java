package com.beautycloud.service.service;

import com.beautycloud.company.entity.Company;
import com.beautycloud.company.repository.CompanyRepository;

import com.beautycloud.service.dto.ServiceItemRequest;
import com.beautycloud.service.dto.ServiceItemResponse;
import com.beautycloud.service.dto.ServiceRequest;
import com.beautycloud.service.dto.ServiceResponse;

import com.beautycloud.service.entity.Service;
import com.beautycloud.service.entity.ServiceItem;

//import com.beautycloud.service.repository.ServiceItemRepository;
import com.beautycloud.service.repository.ServiceRepository;

import com.beautycloud.stock.entity.StockItem;
import com.beautycloud.stock.repository.StockRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
   // private final ServiceItemRepository serviceItemRepository;
    private final CompanyRepository companyRepository;
    private final StockRepository stockRepository;


    // =========================================================
    // CREATE
    // =========================================================

    @Transactional
    public ServiceResponse create(ServiceRequest request) {

        Company company =
                companyRepository.findById(request.getCompanyId())
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Company not found"
                                )
                        );

        Service service =
                Service.builder()
                        .company(company)
                        .name(request.getName())
                        .duration(request.getDuration())
                        .description(request.getDescription())
                        .workerFee(
                                defaultZero(request.getWorkerFee())
                        )
                        .extraFee(
                                defaultZero(request.getExtraFee())
                        )
                        .build();

        List<ServiceItem> serviceItems =
                buildServiceItems(
                        service,
                        company.getId(),
                        request.getItems()
                );

        service.setItems(serviceItems);

        validateStockAvailability(service);

        Service saved = serviceRepository.save(service);

        return toResponse(saved);
    }


    // =========================================================
    // GET BY COMPANY
    // =========================================================

    @Transactional(readOnly = true)
    public List<ServiceResponse> getByCompany(Long companyId) {

        return serviceRepository
                .findByCompanyId(companyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public ServiceResponse getById(Long id) {

        Service service =
                serviceRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Service not found"
                                )
                        );

        return toResponse(service);
    }


    // =========================================================
    // UPDATE
    // =========================================================

    @Transactional
    public ServiceResponse update(
            Long id,
            ServiceRequest request
    ) {

        Service service =
                serviceRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Service not found"
                                )
                        );

        Company company =
                companyRepository.findById(
                        request.getCompanyId()
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Company not found"
                        )
                );

        service.setCompany(company);

        service.setName(
                request.getName()
        );

        service.setDuration(
                request.getDuration()
        );

        service.setDescription(
                request.getDescription()
        );

        service.setWorkerFee(
                defaultZero(request.getWorkerFee())
        );

        service.setExtraFee(
                defaultZero(request.getExtraFee())
        );

        /*
         * Because Service has:
         *
         * @OneToMany(
         *     mappedBy = "service",
         *     cascade = CascadeType.ALL,
         *     orphanRemoval = true
         * )
         *
         * clearing the collection removes the old
         * service_stock_items relationships.
         */
        service.getItems().clear();

        List<ServiceItem> newItems =
                buildServiceItems(
                        service,
                        company.getId(),
                        request.getItems()
                );

        service.getItems().addAll(newItems);

        validateStockAvailability(service);

        Service updated =
                serviceRepository.save(service);

        return toResponse(updated);
    }


 // =========================================================
 // DELETE
 // =========================================================

 @Transactional
 public void delete(Long id) {

     Service service =
             serviceRepository.findById(id)
                     .orElseThrow(() ->
                             new ResponseStatusException(
                                     HttpStatus.NOT_FOUND,
                                     "Service not found"
                             )
                     );

     service.getItems().clear();

     serviceRepository.flush();

     serviceRepository.delete(service);
 }
    @Transactional(readOnly = true)
    public boolean isAvailable(Long serviceId) {

        Service service =
                serviceRepository.findById(serviceId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Service not found"
                                )
                        );

        return checkAvailability(service);
    }


    // =========================================================
    // BUILD SERVICE ITEMS
    // =========================================================

    private List<ServiceItem> buildServiceItems(
            Service service,
            Long companyId,
            List<ServiceItemRequest> requests
    ) {

        List<ServiceItem> result =
                new ArrayList<>();

        if (requests == null) {
            return result;
        }

        for (ServiceItemRequest request : requests) {

            if (request.getStockItemId() == null) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Stock item ID is required"
                );
            }

            if (
                    request.getQuantityUsed() == null
                    ||
                    request.getQuantityUsed()
                            .compareTo(BigDecimal.ZERO) <= 0
            ) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Quantity used must be greater than 0"
                );
            }

            StockItem stockItem =
                    stockRepository.findById(
                            request.getStockItemId()
                    )
                    .orElseThrow(() ->
                            new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Stock item not found: "
                                            + request.getStockItemId()
                            )
                    );

            if (
                    stockItem.getCompany() == null
                    ||
                    stockItem.getCompany()
                            .getId()
                            .equals(companyId)
                    == false
            ) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Stock item does not belong to this company"
                );
            }

            ServiceItem serviceItem =
                    ServiceItem.builder()
                            .service(service)
                            .stockItem(stockItem)
                            .quantityUsed(
                                    request.getQuantityUsed()
                            )
                            .build();

            result.add(serviceItem);
        }

        return result;
    }


    // =========================================================
    // VALIDATE STOCK
    // =========================================================

    private void validateStockAvailability(
            Service service
    ) {

        for (ServiceItem item :
                service.getItems()) {

            StockItem stock =
                    item.getStockItem();

            if (stock == null) {
                continue;
            }

            if (stock.getQuantity() == null) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Stock quantity is not defined for item: "
                                + stock.getName()
                );
            }

            BigDecimal availableQuantity =
                    BigDecimal.valueOf(
                            stock.getQuantity()
                    );

            BigDecimal requiredQuantity =
                    item.getQuantityUsed();

            if (
                    requiredQuantity == null
                    ||
                    availableQuantity.compareTo(
                            requiredQuantity
                    ) < 0
            ) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Not enough stock for item: "
                                + stock.getName()
                );
            }
        }
    }


    // =========================================================
    // CHECK AVAILABILITY
    // =========================================================

    private boolean checkAvailability(
            Service service
    ) {

        for (ServiceItem item :
                service.getItems()) {

            StockItem stock =
                    item.getStockItem();

            if (stock == null) {
                return false;
            }

            if (stock.getQuantity() == null) {
                return false;
            }

            BigDecimal availableQuantity =
                    BigDecimal.valueOf(
                            stock.getQuantity()
                    );

            BigDecimal requiredQuantity =
                    item.getQuantityUsed();

            if (
                    requiredQuantity == null
                    ||
                    availableQuantity.compareTo(
                            requiredQuantity
                    ) < 0
            ) {

                return false;
            }
        }

        return true;
    }


    // =========================================================
    // MATERIAL COST
    // =========================================================

    private BigDecimal calculateMaterialCost(
            Service service
    ) {

        BigDecimal total =
                BigDecimal.ZERO;

        for (ServiceItem item :
                service.getItems()) {

            StockItem stock =
                    item.getStockItem();

            if (stock == null) {
                continue;
            }

            if (stock.getPrice() == null) {
                continue;
            }

            if (stock.getQuantity() == null) {
                continue;
            }

            if (stock.getQuantity() <= 0) {
                continue;
            }

            BigDecimal quantity =
                    item.getQuantityUsed() == null
                            ? BigDecimal.ZERO
                            : item.getQuantityUsed();

            BigDecimal packagePrice =
                    BigDecimal.valueOf(
                            stock.getPrice()
                    );

            BigDecimal packageQuantity =
                    BigDecimal.valueOf(
                            stock.getQuantity()
                    );

            BigDecimal itemCost =
                    packagePrice.multiply(
                            quantity.divide(
                                    packageQuantity,
                                    4,
                                    RoundingMode.HALF_UP
                            )
                    );

            total =
                    total.add(itemCost);
        }

        return total;
    }


    // =========================================================
    // TOTAL PRICE
    // =========================================================

    private BigDecimal calculateTotalPrice(
            Service service
    ) {

        BigDecimal materialCost =
                calculateMaterialCost(service);

        BigDecimal workerFee =
                BigDecimal.valueOf(
                        defaultZero(
                                service.getWorkerFee()
                        )
                );

        BigDecimal extraFee =
                BigDecimal.valueOf(
                        defaultZero(
                                service.getExtraFee()
                        )
                );

        return materialCost
                .add(workerFee)
                .add(extraFee);
    }


    // =========================================================
    // RESPONSE
    // =========================================================

    private ServiceResponse toResponse(
            Service service
    ) {

        BigDecimal materialCost =
                calculateMaterialCost(service);

        BigDecimal totalPrice =
                calculateTotalPrice(service);

        List<ServiceItemResponse> items =
                service.getItems()
                        .stream()
                        .map(item -> {

                            StockItem stock =
                                    item.getStockItem();

                            BigDecimal unitCost =
                                    stock.getPrice() == null
                                            ? BigDecimal.ZERO
                                            : BigDecimal.valueOf(
                                                    stock.getPrice()
                                            );

                            BigDecimal quantity =
                                    item.getQuantityUsed() == null
                                            ? BigDecimal.ZERO
                                            : item.getQuantityUsed();

                            BigDecimal materialItemCost =
                                    BigDecimal.ZERO;

                            if (
                                    stock.getQuantity() != null
                                    &&
                                    stock.getQuantity() > 0
                            ) {

                                BigDecimal packageQuantity =
                                        BigDecimal.valueOf(
                                                stock.getQuantity()
                                        );

                                materialItemCost =
                                        unitCost.multiply(
                                                quantity.divide(
                                                        packageQuantity,
                                                        4,
                                                        RoundingMode.HALF_UP
                                                )
                                        );
                            }

                            return ServiceItemResponse
                                    .builder()
                                    .stockItemId(
                                            stock.getId()
                                    )
                                    .stockItemName(
                                            stock.getName()
                                    )
                                    .unit(
                                            stock.getUnit()
                                    )
                                    .quantityUsed(
                                            quantity
                                    )
                                    .unitCost(
                                            unitCost
                                    )
                                    .materialCost(
                                            materialItemCost
                                    )
                                    .build();
                        })
                        .toList();

        return ServiceResponse
                .builder()
                .id(service.getId())
                .companyId(
                        service.getCompany()
                                .getId()
                )
                .name(service.getName())
                .duration(service.getDuration())
                .description(service.getDescription())
                .workerFee(
                        defaultZero(
                                service.getWorkerFee()
                        )
                )
                .extraFee(
                        defaultZero(
                                service.getExtraFee()
                        )
                )
                .materialCost(
                        materialCost
                )
                .totalPrice(
                        totalPrice
                )
                .available(
                        checkAvailability(service)
                )
                .items(
                        items
                )
                .build();
    }


    // =========================================================
    // DEFAULT ZERO
    // =========================================================

    private Double defaultZero(
            Double value
    ) {

        return value == null
                ? 0.0
                : value;
    }
}