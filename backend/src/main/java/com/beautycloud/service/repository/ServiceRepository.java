package com.beautycloud.service.repository;

import com.beautycloud.service.entity.Service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Service, Long> {

    List<Service> findByCompanyId(Long companyId);
    @Query("""
            SELECT DISTINCT s
            FROM Service s
            LEFT JOIN FETCH s.items
            WHERE s.id = :id
        """)
        Optional<Service> findByIdWithItems(@Param("id") Long id);
}