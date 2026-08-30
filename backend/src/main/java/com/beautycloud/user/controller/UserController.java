package com.beautycloud.user.controller;

import com.beautycloud.user.dto.UserRequest;
import com.beautycloud.user.dto.UserResponse;
import com.beautycloud.user.dto.ChangePasswordRequest;
import com.beautycloud.user.service.UserService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;


    // =========================================================
    // SUPER ADMIN - GET ALL
    // =========================================================

    @GetMapping
    public List<UserResponse> getAll() {

        return userService.getAll();
    }


    // =========================================================
    // SUPER ADMIN - GET ONE
    // =========================================================

    @GetMapping("/{id}")
    public UserResponse getById(
            @PathVariable Long id
    ) {

        return userService.getById(id);
    }


    // =========================================================
    // SUPER ADMIN - CREATE
    // =========================================================

    @PostMapping
    public UserResponse create(
            @Valid @RequestBody UserRequest request
    ) {

        return userService.create(request);
    }


    // =========================================================
    // SUPER ADMIN - UPDATE
    // =========================================================

    @PutMapping("/{id}")
    public UserResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request
    ) {

        return userService.update(
                id,
                request
        );
    }


    // =========================================================
    // SUPER ADMIN - TOGGLE STATUS
    // =========================================================

    @PutMapping("/{id}/toggle-status")
    public UserResponse toggleStatus(
            @PathVariable Long id
    ) {

        return userService.toggleStatus(id);
    }


    // =========================================================
    // CURRENT USER - GET PROFILE
    // =========================================================

    @GetMapping("/me")
    public UserResponse getMyProfile(
            Authentication authentication
    ) {

        return userService.getMyProfile(
                authentication.getName()
        );
    }


    // =========================================================
    // CURRENT USER - EXISTING PROFILE UPDATE
    // =========================================================
    /*
     * Kept exactly for compatibility with the existing
     * application.
     *
     * This endpoint can still update:
     * first name
     * last name
     * phone
     * profile picture
     */

    @PutMapping("/me")
    public UserResponse updateMyProfile(
            Authentication authentication,
            @RequestBody UserRequest request
    ) {

        return userService.updateMyProfile(
                authentication.getName(),
                request
        );
    }


    // =========================================================
    // CURRENT USER - CHANGE PROFILE PICTURE
    // =========================================================
    /*
     * Dedicated endpoint for the profile page.
     *
     * It changes ONLY the picture and does not touch
     * first name, last name, email, phone, role, etc.
     */

    @PatchMapping("/me/profile-picture")
    public UserResponse updateMyProfilePicture(
            Authentication authentication,
            @RequestBody ProfilePictureRequest request
    ) {

        return userService.updateMyProfilePicture(
                authentication.getName(),
                request.getProfilePicture()
        );
    }


    // =========================================================
    // CURRENT USER - REMOVE PROFILE PICTURE
    // =========================================================

    @DeleteMapping("/me/profile-picture")
    public UserResponse removeMyProfilePicture(
            Authentication authentication
    ) {

        return userService.updateMyProfilePicture(
                authentication.getName(),
                null
        );
    }


    // =========================================================
    // CURRENT USER - CHANGE PASSWORD
    // =========================================================
    /*
     * Existing endpoint preserved.
     */

    @PutMapping("/change-password")
    public void changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request
    ) {

        userService.changePassword(
                authentication.getName(),
                request
        );
    }


    // =========================================================
    // PROFILE PICTURE REQUEST
    // =========================================================

    public static class ProfilePictureRequest {

        private String profilePicture;


        public ProfilePictureRequest() {
        }


        public String getProfilePicture() {

            return profilePicture;
        }


        public void setProfilePicture(
                String profilePicture
        ) {

            this.profilePicture =
                    profilePicture;
        }
    }
}