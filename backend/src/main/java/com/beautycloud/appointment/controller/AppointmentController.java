package com.beautycloud.appointment.controller;

import com.beautycloud.appointment.dto.AppointmentRequest;
import com.beautycloud.appointment.dto.AppointmentResponse;
import com.beautycloud.appointment.entity.AppointmentStatus;
import com.beautycloud.appointment.service.AppointmentService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;


    // =========================================================
    // GET COMPANY APPOINTMENTS
    // =========================================================

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<AppointmentResponse>>
    getByCompany(
            @PathVariable Long companyId
    ) {

        return ResponseEntity.ok(
                appointmentService.getByCompany(
                        companyId
                )
        );
    }


    // =========================================================
    // GET ONE
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse>
    getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                appointmentService.getById(id)
        );
    }


    // =========================================================
    // GET BY DATE
    // =========================================================

    @GetMapping("/company/{companyId}/date")
    public ResponseEntity<List<AppointmentResponse>>
    getByDate(
            @PathVariable Long companyId,
            @RequestParam LocalDate date
    ) {

        return ResponseEntity.ok(
                appointmentService.getByDate(
                        companyId,
                        date
                )
        );
    }


    // =========================================================
    // GET BY STATUS
    // =========================================================

    @GetMapping("/company/{companyId}/status")
    public ResponseEntity<List<AppointmentResponse>>
    getByStatus(
            @PathVariable Long companyId,
            @RequestParam AppointmentStatus status
    ) {

        return ResponseEntity.ok(
                appointmentService.getByStatus(
                        companyId,
                        status
                )
        );
    }


    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<AppointmentResponse>
    create(
            @Valid
            @RequestBody
            AppointmentRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        appointmentService.create(
                                request
                        )
                );
    }


    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentResponse>
    update(
            @PathVariable Long id,
            @Valid
            @RequestBody
            AppointmentRequest request
    ) {

        return ResponseEntity.ok(
                appointmentService.update(
                        id,
                        request
                )
        );
    }


    // =========================================================
    // UPDATE STATUS
    // =========================================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<AppointmentResponse>
    updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {

        if (body == null) {
            return ResponseEntity.badRequest().build();
        }

        String statusValue =
                body.get("status");

        if (
                statusValue == null ||
                statusValue.isBlank()
        ) {
            return ResponseEntity.badRequest().build();
        }

        AppointmentStatus status;

        try {

            status =
                    AppointmentStatus.valueOf(
                            statusValue
                                    .trim()
                                    .toUpperCase()
                    );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                appointmentService.updateStatus(
                        id,
                        status
                )
        );
    }


    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    delete(
            @PathVariable Long id
    ) {

        appointmentService.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}