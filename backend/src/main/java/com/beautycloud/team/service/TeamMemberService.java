package com.beautycloud.team.service;

import com.beautycloud.company.entity.Company;
import com.beautycloud.company.repository.CompanyRepository;

import com.beautycloud.team.dto.TeamMemberRequest;
import com.beautycloud.team.dto.TeamMemberResponse;

import com.beautycloud.team.entity.DutyStatus;
import com.beautycloud.team.entity.TeamAvailability;
import com.beautycloud.team.entity.TeamMember;

import com.beautycloud.team.repository.TeamMemberRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;

    private final CompanyRepository companyRepository;


    // =========================================================
    // GET BY COMPANY
    // =========================================================

    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getByCompany(
            Long companyId
    ) {

        return teamMemberRepository
                .findByCompanyId(companyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public TeamMemberResponse getById(
            Long id
    ) {

        TeamMember member =
                teamMemberRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Team member not found"
                                )
                        );

        return toResponse(member);
    }


    // =========================================================
    // CREATE
    // =========================================================

    @Transactional
    public TeamMemberResponse create(
            TeamMemberRequest request
    ) {

        Company company =
                companyRepository
                        .findById(
                                request.getCompanyId()
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Company not found"
                                )
                        );

        DutyStatus dutyStatus =
                request.getDutyStatus() == null
                        ? DutyStatus.ON_DUTY
                        : request.getDutyStatus();

        TeamMember member =
                TeamMember.builder()
                        .company(company)
                        .name(request.getName())
                        .role(request.getRole())
                        .email(request.getEmail())
                        .phone(request.getPhone())
                        .salary(request.getSalary())
                        .picture(request.getPicture())
                        .dutyStatus(dutyStatus)
                        .availability(
                                TeamAvailability.FREE
                        )
                        .appointmentCount(0)
                        .build();

        return toResponse(
                teamMemberRepository.save(member)
        );
    }


    // =========================================================
    // UPDATE
    // =========================================================

    @Transactional
    public TeamMemberResponse update(
            Long id,
            TeamMemberRequest request
    ) {

        TeamMember member =
                teamMemberRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Team member not found"
                                )
                        );

        Company company =
                companyRepository
                        .findById(
                                request.getCompanyId()
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Company not found"
                                )
                        );

        member.setCompany(company);

        member.setName(
                request.getName()
        );

        member.setRole(
                request.getRole()
        );

        member.setEmail(
                request.getEmail()
        );

        member.setPhone(
                request.getPhone()
        );

        member.setSalary(
                request.getSalary()
        );

        if (request.getPicture() != null) {

            member.setPicture(
                    request.getPicture()
            );
        }

        if (request.getDutyStatus() != null) {

            member.setDutyStatus(
                    request.getDutyStatus()
            );
        }

        /*
         * DO NOT TOUCH:
         *
         * availability
         * appointmentCount
         *
         * AppointmentService controls these.
         */

        return toResponse(
                teamMemberRepository.save(member)
        );
    }


    // =========================================================
    // DELETE
    // =========================================================

    @Transactional
    public void delete(Long id) {

        TeamMember member =
                teamMemberRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Team member not found"
                                )
                        );

        teamMemberRepository.delete(member);
    }


    // =========================================================
    // DUTY STATUS
    // =========================================================

    @Transactional
    public TeamMemberResponse updateDutyStatus(
            Long id,
            DutyStatus dutyStatus
    ) {

        TeamMember member =
                teamMemberRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Team member not found"
                                )
                        );

        member.setDutyStatus(
                dutyStatus
        );

        return toResponse(
                teamMemberRepository.save(member)
        );
    }


    // =========================================================
    // RESPONSE
    // =========================================================

    private TeamMemberResponse toResponse(
            TeamMember member
    ) {

        return TeamMemberResponse.builder()
                .id(member.getId())
                .companyId(
                        member.getCompany().getId()
                )
                .name(member.getName())
                .role(member.getRole())
                .email(member.getEmail())
                .phone(member.getPhone())
                .salary(member.getSalary())
                .picture(member.getPicture())
                .dutyStatus(member.getDutyStatus())
                .availability(
                        member.getAvailability()
                )
                .appointmentCount(
                        member.getAppointmentCount()
                )
                .build();
    }
}