package com.beautycloud.company.repository;

import com.beautycloud.company.entity.Company;
import com.beautycloud.user.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    List<Company> findByOwner(User owner);

    List<Company> findByOwnerIsNull();

    @EntityGraph(attributePaths = {"owner"})
    @Query("SELECT c FROM Company c")
    List<Company> findAllWithOwner();

    @EntityGraph(attributePaths = {"owner"})
    @Query("SELECT c FROM Company c WHERE c.id = :id")
    Optional<Company> findByIdWithOwner(Long id);

    @EntityGraph(attributePaths = {"owner"})
    @Query("SELECT c FROM Company c WHERE c.owner = :owner")
    List<Company> findByOwnerWithOwner(User owner);
    
    List<Company> findTop5ByOrderByIdDesc();
}