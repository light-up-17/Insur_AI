package com.insurai.insurai.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.insurai.insurai.model.Claim;
import com.insurai.insurai.repository.ClaimRepository;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;

    public ClaimService(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public List<Claim> getClaimsByUserId(String userId) {
        return claimRepository.findByUserId(userId);
    }

    public Claim saveClaim(Claim claim) {
        return claimRepository.save(claim);
    }

    public Claim updateClaim(String claimId, Claim claim) {
        Optional<Claim> existingClaim = claimRepository.findById(claimId);
        if (existingClaim.isPresent()) {
            Claim updated = existingClaim.get();
            updated.setPolicyId(claim.getPolicyId());
            updated.setUserId(claim.getUserId());
            updated.setDescription(claim.getDescription());
            updated.setStatus(claim.getStatus());
            updated.setAmount(claim.getAmount());
            updated.setDateFiled(claim.getDateFiled());
            return claimRepository.save(updated);
        }
        return null;
    }

    public void deleteClaim(String claimId) {
        claimRepository.deleteById(claimId);
    }
}
