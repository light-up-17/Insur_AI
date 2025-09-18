package com.insurai.insurai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.insurai.insurai.model.AgentAvailability;

@Repository
public interface AgentAvailabilityRepository extends JpaRepository<AgentAvailability, Integer> {
    List<AgentAvailability> findByAgentId(String agentId);
    List<AgentAvailability> findByStatus(String status);
    List<AgentAvailability> findByAgentIdAndStatus(String agentId, String status);
}
