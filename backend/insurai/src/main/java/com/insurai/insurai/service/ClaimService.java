package com.insurai.insurai.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.insurai.insurai.model.Claim;
import com.insurai.insurai.model.User;
import com.insurai.insurai.model.UserCategory;
import com.insurai.insurai.repository.ClaimRepository;
import com.insurai.insurai.repository.UserRepository;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public ClaimService(ClaimRepository claimRepository, NotificationService notificationService, UserRepository userRepository) {
        this.claimRepository = claimRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public List<Claim> getClaimsByUserId(String userId) {
        return claimRepository.findByUserId(userId);
    }

    public Claim saveClaim(Claim claim) {
        claim.setStatus("Pending");
        claim.setDateFiled(LocalDate.now());
        Claim savedClaim = claimRepository.save(claim);

        // Notify all agents and admins about the new claim
        List<User> agentsAndAdmins = userRepository.findByCategoryIn(List.of(UserCategory.AGENT, UserCategory.ADMIN));
        for (User user : agentsAndAdmins) {
            notificationService.createNotification(user.getId(), "NEW_CLAIM", "A new claim has been submitted for review: " + savedClaim.getDescription());
        }

        return savedClaim;
    }

    public Claim updateClaim(String claimId, Claim claim) {
        Optional<Claim> existingClaim = claimRepository.findById(claimId);
        if (existingClaim.isPresent()) {
            Claim updated = existingClaim.get();
            String oldStatus = updated.getStatus();
            updated.setPolicyId(claim.getPolicyId());
            updated.setUserId(claim.getUserId());
            updated.setDescription(claim.getDescription());
            updated.setStatus(claim.getStatus());
            updated.setAmount(claim.getAmount());
            updated.setDateFiled(claim.getDateFiled());
            Claim saved = claimRepository.save(updated);
            // Notify if status changed
            if (!oldStatus.equals(claim.getStatus())) {
                notificationService.createNotification(updated.getUserId(), "CLAIM_UPDATE", "Your claim status has been updated to: " + claim.getStatus());
            }
            return saved;
        }
        return null;
    }

    public void deleteClaim(String claimId) {
        claimRepository.deleteById(claimId);
    }
}
