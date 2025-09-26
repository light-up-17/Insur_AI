package com.insurai.insurai.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.insurai.insurai.model.Policy;
import com.insurai.insurai.repository.PolicyRepository;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final NotificationService notificationService;

    public PolicyService(PolicyRepository policyRepository, NotificationService notificationService) {
        this.policyRepository = policyRepository;
        this.notificationService = notificationService;
    }

    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    public List<Policy> getPoliciesByUserId(String userId) {
        return policyRepository.findByUserId(userId);
    }

    public List<Policy> getPoliciesByAgentId(String agentId) {
        return policyRepository.findByAgentId(agentId);
    }

    public Policy savePolicy(Policy policy) {
        if (policy.getName() == null) {
            policy.setName(policy.getType() + " Policy");
        }
        if (policy.getCreatedDate() == null) {
            policy.setCreatedDate(LocalDate.now());
        }
        if (policy.getClients() == null) {
            policy.setClients(0);
        }
        if (policy.getClaims() == null) {
            policy.setClaims(0);
        }
        return policyRepository.save(policy);
    }

    public Policy updatePolicy(String policyId, Policy policy) {
        Optional<Policy> existingPolicy = policyRepository.findById(policyId);
        if (existingPolicy.isPresent()) {
            Policy updated = existingPolicy.get();
            updated.setUserId(policy.getUserId());
            updated.setName(policy.getName());
            updated.setType(policy.getType());
            updated.setStatus(policy.getStatus());
            updated.setPremium(policy.getPremium());
            updated.setCoverage(policy.getCoverage());
            updated.setCreatedDate(policy.getCreatedDate());
            updated.setClients(policy.getClients());
            updated.setClaims(policy.getClaims());
            updated.setStartDate(policy.getStartDate());
            updated.setEndDate(policy.getEndDate());
            return policyRepository.save(updated);
        }
        return null;
    }

    public void deletePolicy(String policyId) {
        policyRepository.deleteById(policyId);
    }

    public List<Policy> getAvailablePolicies() {
        return policyRepository.findByUserIdIsNull();
    }

    public Policy buyPolicy(String policyId, String userId) {
        Optional<Policy> templateOpt = policyRepository.findById(policyId);
        if (templateOpt.isEmpty() || templateOpt.get().getUserId() != null) {
            return null; // Not a template or doesn't exist
        }
        Policy template = templateOpt.get();
        Policy purchase = Policy.builder()
                .userId(userId)
                .name(template.getName())
                .type(template.getType())
                .status("Active") // Assuming active when bought
                .premium(template.getPremium())
                .coverage(template.getCoverage())
                .createdDate(LocalDate.now())
                .clients(1) // Or increment
                .claims(0)
                .startDate(LocalDate.now())
                .endDate(template.getEndDate()) // Or calculate
                .build();
        Policy saved = policyRepository.save(purchase);
        // Notify user
        notificationService.createNotification(userId, "POLICY_PURCHASE", "You have successfully purchased the policy: " + saved.getName());
        return saved;
    }
}
