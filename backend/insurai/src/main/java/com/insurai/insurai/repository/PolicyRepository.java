package com.insurai.insurai.repository;

import com.insurai.insurai.model.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, String> {
    List<Policy> findByUserId(String userId);
    List<Policy> findByStatus(String status);
}
