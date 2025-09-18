package com.insurai.insurai.service;

import com.insurai.insurai.model.Policy;
import com.insurai.insurai.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;

    public PolicyService(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    public List<Policy> getPoliciesByUserId(String userId) {
        return policyRepository.findByUserId(userId);
    }

    public Policy savePolicy(Policy policy) {
        return policyRepository.save(policy);
    }

    public void deletePolicy(String policyId) {
        policyRepository.deleteById(policyId);
    }
}
