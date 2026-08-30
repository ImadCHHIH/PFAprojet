package com.beautycloud.role.repository;

import com.beautycloud.role.entity.Role;
import com.beautycloud.role.entity.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleType name);

}