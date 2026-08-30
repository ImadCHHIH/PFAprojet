package com.beautycloud.user.entity;

import com.beautycloud.common.entity.BaseEntity;
import com.beautycloud.company.entity.Company;
import com.beautycloud.role.entity.Role;

import jakarta.persistence.*;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    /**
     * User role
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    /**
     * First login password change requirement.
     *
     * New users receive a temporary password,
     * therefore this must be TRUE when a user is created.
     */
    @Column(
        name = "must_change_password",
        nullable = false
    )
    @Builder.Default
    private Boolean mustChangePassword = true;

    /**
     * Companies owned by this user.
     */
    @OneToMany(mappedBy = "owner")
    @Builder.Default
    private List<Company> companies = new ArrayList<>();

    /**
     * Profile picture.
     *
     * Kept as String so existing functionality
     * remains unchanged.
     */
    @Column(columnDefinition = "TEXT")
    private String profilePicture;
}

