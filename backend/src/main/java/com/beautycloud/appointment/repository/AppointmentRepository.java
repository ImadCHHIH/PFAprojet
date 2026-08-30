package com.beautycloud.appointment.repository;

import com.beautycloud.appointment.entity.Appointment;
import com.beautycloud.appointment.entity.AppointmentStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByCompanyId(Long companyId);

    List<Appointment> findByCompanyIdAndAppointmentDate(
            Long companyId,
            LocalDate appointmentDate
    );

    List<Appointment> findByCompanyIdAndStatus(
            Long companyId,
            AppointmentStatus status
    );

    List<Appointment> findByTeamMemberIdAndAppointmentDate(
            Long teamMemberId,
            LocalDate appointmentDate
    );
}