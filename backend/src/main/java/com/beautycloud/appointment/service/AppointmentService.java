package com.beautycloud.appointment.service;

import com.beautycloud.appointment.dto.AppointmentRequest;
import com.beautycloud.appointment.dto.AppointmentResponse;
import com.beautycloud.appointment.entity.Appointment;
import com.beautycloud.appointment.entity.AppointmentStatus;
import com.beautycloud.appointment.repository.AppointmentRepository;

import com.beautycloud.promo.entity.PromoCode;
import com.beautycloud.promo.service.PromoCodeService;

import com.beautycloud.service.entity.Service;
import com.beautycloud.service.entity.ServiceItem;
import com.beautycloud.service.repository.ServiceRepository;

import com.beautycloud.stock.entity.StockItem;

import com.beautycloud.team.entity.TeamAvailability;
import com.beautycloud.team.entity.TeamMember;
import com.beautycloud.team.repository.TeamMemberRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    private final PromoCodeService promoCodeService;

    private final ServiceRepository serviceRepository;

    private final TeamMemberRepository teamRepository;


    // =========================================================
    // GET ALL
    // =========================================================

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getByCompany(Long companyId) {

        return appointmentRepository
                .findByCompanyId(companyId)
                .stream()
                .map(AppointmentResponse::fromEntity)
                .toList();
    }


    // =========================================================
    // GET ONE
    // =========================================================

    @Transactional(readOnly = true)
    public AppointmentResponse getById(Long id) {

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found."
                                )
                        );

        return AppointmentResponse.fromEntity(appointment);
    }


    // =========================================================
    // MATERIAL COST
    // =========================================================

    private BigDecimal calculateMaterialCost(
            com.beautycloud.service.entity.Service service
    ) {

        if (
                service.getItems() == null ||
                service.getItems().isEmpty()
        ) {
            return BigDecimal.ZERO;
        }

        BigDecimal total = BigDecimal.ZERO;

        for (ServiceItem item : service.getItems()) {

            if (item == null ||
                    item.getStockItem() == null) {
                continue;
            }

            BigDecimal packagePrice =
                    item.getStockItem().getPrice() == null
                            ? BigDecimal.ZERO
                            : BigDecimal.valueOf(
                                    item.getStockItem().getPrice()
                            );

            BigDecimal packageQuantity =
                    item.getStockItem().getQuantity() == null
                            ? BigDecimal.ZERO
                            : BigDecimal.valueOf(
                                    item.getStockItem().getQuantity()
                            );

            BigDecimal quantityUsed =
                    item.getQuantityUsed() == null
                            ? BigDecimal.ZERO
                            : item.getQuantityUsed();

            if (
                    packageQuantity.compareTo(
                            BigDecimal.ZERO
                    ) <= 0
            ) {
                continue;
            }

            BigDecimal itemCost =
                    packagePrice.multiply(
                            quantityUsed.divide(
                                    packageQuantity,
                                    6,
                                    RoundingMode.HALF_UP
                            )
                    );

            total = total.add(itemCost);
        }

        return total.setScale(
                2,
                RoundingMode.HALF_UP
        );
    }


    // =========================================================
    // SERVICE PRICE
    // =========================================================

    private BigDecimal calculateServicePrice(
            Service service
    ) {

        BigDecimal materialCost =
                calculateMaterialCost(service);

        BigDecimal workerFee =
                service.getWorkerFee() == null
                        ? BigDecimal.ZERO
                        : BigDecimal.valueOf(
                                service.getWorkerFee()
                        );

        BigDecimal extraFee =
                service.getExtraFee() == null
                        ? BigDecimal.ZERO
                        : BigDecimal.valueOf(
                                service.getExtraFee()
                        );

        return materialCost
                .add(workerFee)
                .add(extraFee)
                .setScale(
                        2,
                        RoundingMode.HALF_UP
                );
    }


    // =========================================================
    // VALIDATE COMPANY
    // =========================================================

    private void validateServiceCompany(
            Service service,
            Long companyId
    ) {

        if (
                service.getCompany() == null ||
                service.getCompany().getId() == null
        ) {
            throw new RuntimeException(
                    "Service has no company."
            );
        }

        if (
                !service.getCompany()
                        .getId()
                        .equals(companyId)
        ) {
            throw new RuntimeException(
                    "Service does not belong to this company."
            );
        }
    }


    private void validateTeamMemberCompany(
            TeamMember teamMember,
            Long companyId
    ) {

        if (
                teamMember.getCompany() == null ||
                teamMember.getCompany().getId() == null
        ) {
            throw new RuntimeException(
                    "Team member has no company."
            );
        }

        if (
                !teamMember.getCompany()
                        .getId()
                        .equals(companyId)
        ) {
            throw new RuntimeException(
                    "Team member does not belong to this company."
            );
        }
    }


    // =========================================================
    // SERVICE END TIME
    // =========================================================

    private LocalTime calculateEndTime(
            LocalTime start,
            Service service
    ) {

        int duration =
                service.getDuration() == null
                        ? 0
                        : service.getDuration();

        return start.plusMinutes(duration);
    }


    // =========================================================
    // CHECK WORKER AVAILABILITY
    // =========================================================

    private void validateWorkerAvailability(
            Long teamMemberId,
            LocalDate date,
            LocalTime start,
            LocalTime end,
            Long ignoredAppointmentId
    ) {

        List<Appointment> appointments =
                appointmentRepository
                        .findByTeamMemberIdAndAppointmentDate(
                                teamMemberId,
                                date
                        );

        for (Appointment existing : appointments) {

            if (
                    ignoredAppointmentId != null &&
                    existing.getId().equals(
                            ignoredAppointmentId
                    )
            ) {
                continue;
            }

            /*
             * CANCELED appointments do not block the worker.
             */
            if (
                    existing.getStatus() ==
                            AppointmentStatus.CANCELED
            ) {
                continue;
            }

            /*
             * COMPLETED appointments are finished
             * and therefore do not block a future appointment.
             */
            if (
                    existing.getStatus() ==
                            AppointmentStatus.COMPLETED
            ) {
                continue;
            }

            Service existingService =
                    serviceRepository
                            .findById(
                                    existing.getServiceId()
                            )
                            .orElse(null);

            if (existingService == null) {
                continue;
            }

            LocalTime existingStart =
                    existing.getAppointmentTime();

            LocalTime existingEnd =
                    calculateEndTime(
                            existingStart,
                            existingService
                    );

            /*
             * Overlap:
             *
             * newStart < existingEnd
             * AND
             * newEnd > existingStart
             */
            boolean overlaps =
                    start.isBefore(existingEnd) &&
                    end.isAfter(existingStart);

            if (overlaps) {

                throw new RuntimeException(
                        "Ce membre de l'équipe a déjà un rendez-vous pendant cette période."
                );
            }
        }
    }


    // =========================================================
    // BOOK WORKER
    // =========================================================

    private void bookWorker(
            TeamMember teamMember
    ) {

        teamMember.setAvailability(
                TeamAvailability.BOOKED
        );

        teamRepository.save(teamMember);
    }


    // =========================================================
    // RELEASE WORKER IF FREE
    // =========================================================

    private void refreshWorkerAvailability(
            Long teamMemberId
    ) {

        TeamMember member =
                teamRepository
                        .findById(teamMemberId)
                        .orElse(null);

        if (member == null) {
            return;
        }

        List<Appointment> appointments =
                appointmentRepository
                        .findByTeamMemberIdAndAppointmentDate(
                                teamMemberId,
                                LocalDate.now()
                        );

        boolean hasActiveAppointment =
                appointments.stream()
                        .anyMatch(a ->
                                a.getStatus() !=
                                        AppointmentStatus.CANCELED &&
                                a.getStatus() !=
                                        AppointmentStatus.COMPLETED
                        );

        if (!hasActiveAppointment) {

            member.setAvailability(
                    TeamAvailability.FREE
            );

            teamRepository.save(member);
        }
    }


    // =========================================================
    // DEDUCT STOCK
    // =========================================================

    private void deductStock(
            Appointment appointment
    ) {

        if (appointment.isStockDeducted()) {
            return;
        }

        Service service =
                serviceRepository
                        .findByIdWithItems(
                                appointment.getServiceId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Service not found."
                                )
                        );

        if (
                service.getItems() == null ||
                service.getItems().isEmpty()
        ) {

            appointment.setStockDeducted(true);

            return;
        }

        for (ServiceItem serviceItem :
                service.getItems()) {

            if (
                    serviceItem == null ||
                    serviceItem.getStockItem() == null
            ) {
                continue;
            }

            BigDecimal quantityUsed =
                    serviceItem.getQuantityUsed() == null
                            ? BigDecimal.ZERO
                            : serviceItem.getQuantityUsed();

            if (
                    quantityUsed.compareTo(
                            BigDecimal.ZERO
                    ) <= 0
            ) {
                continue;
            }

            StockItem stockItem =
                    serviceItem.getStockItem();

            double currentQuantity =
                    stockItem.getQuantity() == null
                            ? 0.0
                            : stockItem.getQuantity();

            double used =
                    quantityUsed.doubleValue();

            double newQuantity =
                    currentQuantity - used;

            if (newQuantity < 0) {

                throw new RuntimeException(
                        "Stock insuffisant pour le produit : "
                                + stockItem.getName()
                );
            }

            stockItem.setQuantity(
                    newQuantity
            );
        }

        appointment.setStockDeducted(true);
    }


    // =========================================================
    // CREATE
    // =========================================================

    @Transactional
    public AppointmentResponse create(
            AppointmentRequest request
    ) {

        Service service =
                serviceRepository
                        .findByIdWithItems(
                                request.getServiceId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Service not found."
                                )
                        );

        validateServiceCompany(
                service,
                request.getCompanyId()
        );

        TeamMember teamMember =
                teamRepository
                        .findById(
                                request.getTeamMemberId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Team member not found."
                                )
                        );

        validateTeamMemberCompany(
                teamMember,
                request.getCompanyId()
        );

        // -----------------------------------------------------
        // DURATION / AVAILABILITY
        // -----------------------------------------------------

        LocalTime endTime =
                calculateEndTime(
                        request.getAppointmentTime(),
                        service
                );

        validateWorkerAvailability(
                teamMember.getId(),
                request.getAppointmentDate(),
                request.getAppointmentTime(),
                endTime,
                null
        );

        // -----------------------------------------------------
        // PRICE
        // -----------------------------------------------------

        BigDecimal originalPrice =
                calculateServicePrice(service);

        PromoCode promo =
                promoCodeService.findValidPromo(
                        request.getCompanyId(),
                        request.getPromoCodeId(),
                        request.getAppointmentDate()
                );

        BigDecimal discountPercentage =
                BigDecimal.ZERO;

        BigDecimal discountAmount =
                BigDecimal.ZERO;

        Long promoCodeId = null;

        String promoCode = null;

        if (promo != null) {

            discountPercentage =
                    promo.getDiscountPercentage();

            promoCode =
                    promo.getCode();

            promoCodeId =
                    promo.getId();

            discountAmount =
                    originalPrice.multiply(
                            discountPercentage.divide(
                                    BigDecimal.valueOf(100),
                                    6,
                                    RoundingMode.HALF_UP
                            )
                    ).setScale(
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        BigDecimal finalPrice =
                originalPrice.subtract(
                        discountAmount
                ).setScale(
                        2,
                        RoundingMode.HALF_UP
                );

        // -----------------------------------------------------
        // APPOINTMENT
        // -----------------------------------------------------

        Appointment appointment =
                new Appointment();

        appointment.setCompanyId(
                request.getCompanyId()
        );

        appointment.setClientName(
                request.getClientName().trim()
        );

        appointment.setServiceId(
                service.getId()
        );

        appointment.setServiceName(
                service.getName()
        );

        appointment.setTeamMemberId(
                teamMember.getId()
        );

        appointment.setTeamMemberName(
                teamMember.getName()
        );

        appointment.setAppointmentDate(
                request.getAppointmentDate()
        );

        appointment.setAppointmentTime(
                request.getAppointmentTime()
        );

        appointment.setStatus(
                AppointmentStatus.PENDING
        );

        appointment.setOriginalPrice(
                originalPrice
        );

        appointment.setDiscountAmount(
                discountAmount
        );

        appointment.setFinalPrice(
                finalPrice
        );

        appointment.setPromoCodeId(
                promoCodeId
        );

        appointment.setPromoCode(
                promoCode
        );

        appointment.setPromoDiscountPercentage(
                discountPercentage
        );

        appointment.setStockDeducted(false);

        appointment.setAppointmentCountIncremented(
                false
        );

        Appointment saved =
                appointmentRepository.save(
                        appointment
                );

        // -----------------------------------------------------
        // BOOK WORKER
        // -----------------------------------------------------

        bookWorker(teamMember);

        return AppointmentResponse.fromEntity(
                saved
        );
    }


    // =========================================================
    // UPDATE
    // =========================================================

    @Transactional
    public AppointmentResponse update(
            Long id,
            AppointmentRequest request
    ) {

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found."
                                )
                        );

        Long oldTeamMemberId =
                appointment.getTeamMemberId();

        Service service =
                serviceRepository
                        .findByIdWithItems(
                                request.getServiceId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Service not found."
                                )
                        );

        validateServiceCompany(
                service,
                request.getCompanyId()
        );

        TeamMember teamMember =
                teamRepository
                        .findById(
                                request.getTeamMemberId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Team member not found."
                                )
                        );

        validateTeamMemberCompany(
                teamMember,
                request.getCompanyId()
        );

        LocalTime endTime =
                calculateEndTime(
                        request.getAppointmentTime(),
                        service
                );

        validateWorkerAvailability(
                teamMember.getId(),
                request.getAppointmentDate(),
                request.getAppointmentTime(),
                endTime,
                appointment.getId()
        );

        BigDecimal originalPrice =
                calculateServicePrice(service);

        PromoCode promo =
                promoCodeService.findValidPromo(
                        request.getCompanyId(),
                        request.getPromoCodeId(),
                        request.getAppointmentDate()
                );

        BigDecimal discountPercentage =
                BigDecimal.ZERO;

        BigDecimal discountAmount =
                BigDecimal.ZERO;

        Long promoId = null;

        String promoCode = null;

        if (promo != null) {

            discountPercentage =
                    promo.getDiscountPercentage();

            promoId =
                    promo.getId();

            promoCode =
                    promo.getCode();

            discountAmount =
                    originalPrice.multiply(
                            discountPercentage.divide(
                                    BigDecimal.valueOf(100),
                                    6,
                                    RoundingMode.HALF_UP
                            )
                    ).setScale(
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        BigDecimal finalPrice =
                originalPrice.subtract(
                        discountAmount
                ).setScale(
                        2,
                        RoundingMode.HALF_UP
                );

        appointment.setCompanyId(
                request.getCompanyId()
        );

        appointment.setClientName(
                request.getClientName().trim()
        );

        appointment.setServiceId(
                service.getId()
        );

        appointment.setServiceName(
                service.getName()
        );

        appointment.setTeamMemberId(
                teamMember.getId()
        );

        appointment.setTeamMemberName(
                teamMember.getName()
        );

        appointment.setAppointmentDate(
                request.getAppointmentDate()
        );

        appointment.setAppointmentTime(
                request.getAppointmentTime()
        );

        appointment.setOriginalPrice(
                originalPrice
        );

        appointment.setDiscountAmount(
                discountAmount
        );

        appointment.setFinalPrice(
                finalPrice
        );

        appointment.setPromoCodeId(
                promoId
        );

        appointment.setPromoCode(
                promoCode
        );

        appointment.setPromoDiscountPercentage(
                discountPercentage
        );

        Appointment saved =
                appointmentRepository.save(
                        appointment
                );

        bookWorker(teamMember);

        if (
                oldTeamMemberId != null &&
                !oldTeamMemberId.equals(
                        teamMember.getId()
                )
        ) {
            refreshWorkerAvailability(
                    oldTeamMemberId
            );
        }

        return AppointmentResponse.fromEntity(
                saved
        );
    }


    // =========================================================
    // UPDATE STATUS
    // =========================================================

    @Transactional
    public AppointmentResponse updateStatus(
            Long id,
            AppointmentStatus status
    ) {

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found."
                                )
                        );

        if (status == null) {

            throw new RuntimeException(
                    "Appointment status is required."
            );
        }

        AppointmentStatus oldStatus =
                appointment.getStatus();

        /*
         * Nothing to do if the status didn't actually change.
         */
        if (oldStatus == status) {

            return AppointmentResponse.fromEntity(
                    appointment
            );
        }

        // =====================================================
        // COMPLETED
        // =====================================================

        if (
                status == AppointmentStatus.COMPLETED
        ) {

            /*
             * Deduct stock exactly once.
             */
            deductStock(appointment);

            /*
             * Increment worker appointment count exactly once.
             */
            if (
                    !appointment
                            .isAppointmentCountIncremented()
            ) {

                TeamMember teamMember =
                        teamRepository
                                .findById(
                                        appointment
                                                .getTeamMemberId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Team member not found."
                                        )
                                );

                Integer count =
                        teamMember
                                .getAppointmentCount();

                if (count == null) {
                    count = 0;
                }

                teamMember.setAppointmentCount(
                        count + 1
                );

                teamRepository.save(
                        teamMember
                );

                appointment.setAppointmentCountIncremented(
                        true
                );
            }

            appointment.setStatus(
                    AppointmentStatus.COMPLETED
            );

            Appointment saved =
                    appointmentRepository.save(
                            appointment
                    );

            /*
             * Completed appointment no longer occupies worker.
             */
            refreshWorkerAvailability(
                    appointment.getTeamMemberId()
            );

            return AppointmentResponse.fromEntity(
                    saved
            );
        }


        // =====================================================
        // CANCELED
        // =====================================================

        if (
                status == AppointmentStatus.CANCELED
        ) {

            /*
             * NEVER deduct stock for canceled appointment.
             */
            appointment.setStatus(
                    AppointmentStatus.CANCELED
            );

            Appointment saved =
                    appointmentRepository.save(
                            appointment
                    );

            refreshWorkerAvailability(
                    appointment.getTeamMemberId()
            );

            return AppointmentResponse.fromEntity(
                    saved
            );
        }


        // =====================================================
        // OTHER STATUS
        // =====================================================

        appointment.setStatus(status);

        Appointment saved =
                appointmentRepository.save(
                        appointment
                );

        bookWorker(
                teamRepository.findById(
                        appointment.getTeamMemberId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Team member not found."
                        )
                )
        );

        return AppointmentResponse.fromEntity(
                saved
        );
    }


    // =========================================================
    // DELETE
    // =========================================================

    @Transactional
    public void delete(Long id) {

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found."
                                )
                        );

        Long teamMemberId =
                appointment.getTeamMemberId();

        appointmentRepository.delete(
                appointment
        );

        refreshWorkerAvailability(
                teamMemberId
        );
    }


    // =========================================================
    // GET BY DATE
    // =========================================================

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getByDate(
            Long companyId,
            LocalDate date
    ) {

        return appointmentRepository
                .findByCompanyIdAndAppointmentDate(
                        companyId,
                        date
                )
                .stream()
                .map(AppointmentResponse::fromEntity)
                .toList();
    }


    // =========================================================
    // GET BY STATUS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getByStatus(
            Long companyId,
            AppointmentStatus status
    ) {

        return appointmentRepository
                .findByCompanyIdAndStatus(
                        companyId,
                        status
                )
                .stream()
                .map(AppointmentResponse::fromEntity)
                .toList();
    }
}