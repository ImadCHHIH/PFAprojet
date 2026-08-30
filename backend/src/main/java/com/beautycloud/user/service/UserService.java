package com.beautycloud.user.service;

import com.beautycloud.notification.service.NotificationService;
import com.beautycloud.user.dto.ChangePasswordRequest;
import com.beautycloud.user.dto.UserRequest;
import com.beautycloud.user.dto.UserResponse;
import com.beautycloud.user.entity.User;
import com.beautycloud.user.repository.UserRepository;

import com.beautycloud.email.EmailService;

import com.beautycloud.role.entity.Role;
import com.beautycloud.role.entity.RoleType;
import com.beautycloud.role.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final NotificationService notificationService;

    private final EmailService emailService;

    private final RoleRepository roleRepository;


    // =========================================================
    // GET ALL
    // =========================================================

    public List<UserResponse> getAll() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    public UserResponse getById(Long id) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        return toResponse(user);
    }


    // =========================================================
    // CREATE
    // =========================================================

    @Transactional
    public UserResponse create(
            UserRequest request
    ) {

        if (
                userRepository.existsByEmail(
                        request.getEmail()
                )
        ) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }


        Role salonAdminRole =
                roleRepository
                        .findByName(
                                RoleType.SALON_ADMIN
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "SALON_ADMIN role not found"
                                )
                        );


        // =====================================================
        // GENERATE TEMPORARY PASSWORD
        // =====================================================

        String temporaryPassword =
                generatePassword();


        // =====================================================
        // CREATE USER
        // =====================================================

        User user =
                User.builder()
                        .firstName(
                                request.getFirstName()
                        )
                        .lastName(
                                request.getLastName()
                        )
                        .email(
                                request.getEmail()
                        )
                        .password(
                                passwordEncoder.encode(
                                        temporaryPassword
                                )
                        )
                        .phone(
                                request.getPhone()
                        )
                        .active(
                                request.getActive()
                        )

                        /*
                         * IMPORTANT:
                         *
                         * Every newly created user receives
                         * a temporary password.
                         *
                         * Therefore they MUST change it
                         * on their first login.
                         */
                        .mustChangePassword(true)

                        .profilePicture(
                                request.getProfilePicture()
                        )
                        .role(
                                salonAdminRole
                        )
                        .build();


        user =
                userRepository.save(user);


        // =====================================================
        // SEND TEMPORARY PASSWORD BY EMAIL
        // =====================================================

        emailService.sendWelcomeEmail(
                user.getEmail(),
                user.getFirstName(),
                temporaryPassword
        );


        // =====================================================
        // CREATE NOTIFICATION
        // =====================================================

        notificationService.create(
                "New user",
                user.getFirstName()
                        + " "
                        + user.getLastName()
                        + " has been created.",
                "USER"
        );


        // =====================================================
        // RESPONSE
        // =====================================================

        UserResponse response =
                toResponse(user);


        /*
         * Keep this because your UserPage currently
         * displays the temporary password after creation.
         *
         * The email is still the official delivery mechanism.
         */
        response.setTemporaryPassword(
                temporaryPassword
        );


        return response;
    }


    // =========================================================
    // UPDATE
    // SUPER ADMIN
    // =========================================================

    @Transactional
    public UserResponse update(
            Long id,
            UserRequest request
    ) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        if (
                !user.getEmail()
                        .equals(request.getEmail())
                &&
                userRepository.existsByEmail(
                        request.getEmail()
                )
        ) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }


        user.setFirstName(
                request.getFirstName()
        );

        user.setLastName(
                request.getLastName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPhone(
                request.getPhone()
        );

        user.setActive(
                request.getActive()
        );

        user.setProfilePicture(
                request.getProfilePicture()
        );


        /*
         * IMPORTANT:
         *
         * We do NOT touch mustChangePassword here.
         *
         * Editing a user's profile should not suddenly
         * force them to change their password.
         *
         * The password-change flag is controlled by
         * the authentication/password workflow.
         */


        user =
                userRepository.save(user);


        notificationService.create(
                "User updated",
                user.getFirstName()
                        + " "
                        + user.getLastName()
                        + " profile was updated.",
                "USER"
        );


        return toResponse(user);
    }


    // =========================================================
    // TOGGLE STATUS
    // SUPER ADMIN
    // =========================================================

    @Transactional
    public UserResponse toggleStatus(
            Long id
    ) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        user.setActive(
                !user.getActive()
        );


        user =
                userRepository.save(user);


        notificationService.create(
                "User status changed",
                user.getFirstName()
                        + " "
                        + user.getLastName()
                        +
                        (
                                user.getActive()
                                        ? " was activated."
                                        : " was deactivated."
                        ),
                "USER"
        );


        return toResponse(user);
    }


    // =========================================================
    // GET MY PROFILE
    // =========================================================

    @Transactional(readOnly = true)
    public UserResponse getMyProfile(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        return toResponse(user);
    }


    // =========================================================
    // UPDATE MY PROFILE
    // EXISTING FUNCTIONALITY PRESERVED
    // =========================================================

    @Transactional
    public UserResponse updateMyProfile(
            String email,
            UserRequest request
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        user.setFirstName(
                request.getFirstName()
        );

        user.setLastName(
                request.getLastName()
        );

        user.setPhone(
                request.getPhone()
        );

        user.setProfilePicture(
                request.getProfilePicture()
        );


        user =
                userRepository.save(user);


        notificationService.create(
                "Profile updated",
                user.getFirstName()
                        + " "
                        + user.getLastName()
                        + " updated their profile.",
                "PROFILE"
        );


        return toResponse(user);
    }


    // =========================================================
    // UPDATE MY PROFILE PICTURE
    // =========================================================

    @Transactional
    public UserResponse updateMyProfilePicture(
            String email,
            String profilePicture
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        user.setProfilePicture(
                profilePicture
        );


        user =
                userRepository.save(user);


        notificationService.create(
                "Profile picture updated",
                user.getFirstName()
                        + " "
                        + user.getLastName()
                        + " updated their profile picture.",
                "PROFILE"
        );


        return toResponse(user);
    }


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    @Transactional
    public void changePassword(
            String email,
            ChangePasswordRequest request
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );


        /*
         * Once the user changes the temporary password,
         * they no longer need to be forced to change it.
         */
        user.setMustChangePassword(
                false
        );


        userRepository.save(user);


        notificationService.create(
                "Password changed",
                user.getFirstName()
                        + " "
                        + user.getLastName()
                        + " changed the account password.",
                "SECURITY"
        );
    }


    // =========================================================
    // RESPONSE
    // =========================================================

    private UserResponse toResponse(
            User user
    ) {

        return UserResponse.builder()
                .id(
                        user.getId()
                )
                .firstName(
                        user.getFirstName()
                )
                .lastName(
                        user.getLastName()
                )
                .email(
                        user.getEmail()
                )
                .phone(
                        user.getPhone()
                )
                .active(
                        user.getActive()
                )
                .profilePicture(
                        user.getProfilePicture()
                )
                .build();
    }


    // =========================================================
    // TEMPORARY PASSWORD GENERATOR
    // =========================================================

    private String generatePassword() {

        String characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                        + "abcdefghijklmnopqrstuvwxyz"
                        + "0123456789";


        SecureRandom random =
                new SecureRandom();


        StringBuilder password =
                new StringBuilder();


        for (
                int i = 0;
                i < 10;
                i++
        ) {

            password.append(
                    characters.charAt(
                            random.nextInt(
                                    characters.length()
                            )
                    )
            );
        }


        return password.toString();
    }
}

