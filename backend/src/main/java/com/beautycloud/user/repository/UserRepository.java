package com.beautycloud.user.repository;

import com.beautycloud.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
        SELECT DISTINCT u
        FROM User u
        LEFT JOIN FETCH u.companies
        """)
    List<User> findAllWithCompanies();

    @Query("""
        SELECT u
        FROM User u
        LEFT JOIN FETCH u.companies
        WHERE u.id = :id
        """)
    Optional<User> findByIdWithCompanies(Long id);

}