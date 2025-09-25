package com.insurai.insurai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.insurai.insurai.model.Policy;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, String> {
    List<Policy> findByUserId(String userId);
    List<Policy> findByUserIdIsNull();
    List<Policy> findByStatus(String status);
}
