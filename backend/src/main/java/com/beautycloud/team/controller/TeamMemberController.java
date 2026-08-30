package com.beautycloud.team.controller;

import com.beautycloud.team.dto.TeamMemberRequest;
import com.beautycloud.team.dto.TeamMemberResponse;
import com.beautycloud.team.entity.DutyStatus;
import com.beautycloud.team.service.TeamMemberService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    // =========================================================
    // GET ALL BY COMPANY
    // =========================================================

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<TeamMemberResponse>> getByCompany(
            @PathVariable Long companyId
    ) {

        return ResponseEntity.ok(
                teamMemberService.getByCompany(companyId)
        );
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<TeamMemberResponse> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                teamMemberService.getById(id)
        );
    }

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<TeamMemberResponse> create(
            @Valid @RequestBody TeamMemberRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        teamMemberService.create(request)
                );
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<TeamMemberResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TeamMemberRequest request
    ) {

        return ResponseEntity.ok(
                teamMemberService.update(
                        id,
                        request
                )
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        teamMemberService.delete(id);

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // UPDATE DUTY STATUS
    // =========================================================

    @PatchMapping("/{id}/duty-status")
    public ResponseEntity<TeamMemberResponse> updateDutyStatus(
            @PathVariable Long id,
            @RequestParam DutyStatus status
    ) {

        return ResponseEntity.ok(
                teamMemberService.updateDutyStatus(
                        id,
                        status
                )
        );
    }
}