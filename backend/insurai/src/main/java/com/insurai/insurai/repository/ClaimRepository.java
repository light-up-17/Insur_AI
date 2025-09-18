package com.insurai.insurai.repository;

import com.insurai.insurai.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, String> {
    List<Claim> findByUserId(String userId);
    List<Claim> findByPolicyId(String policyId);
    List<Claim> findByStatus(String status);
}
