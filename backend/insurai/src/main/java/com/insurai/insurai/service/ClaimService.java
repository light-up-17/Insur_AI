package com.insurai.insurai.service;

import com.insurai.insurai.model.Claim;
import com.insurai.insurai.repository.ClaimRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;

    public ClaimService(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    public List<Claim> getClaimsByUserId(String userId) {
        return claimRepository.findByUserId(userId);
    }

    public Claim saveClaim(Claim claim) {
        return claimRepository.save(claim);
    }

    public void deleteClaim(String claimId) {
        claimRepository.deleteById(claimId);
    }
}
