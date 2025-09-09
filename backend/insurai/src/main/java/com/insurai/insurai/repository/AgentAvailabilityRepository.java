package com.insurai.insurai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.insurai.insurai.model.AgentAvailability;

@Repository
public interface AgentAvailabilityRepository extends JpaRepository<AgentAvailability, Integer> {
    // Make sure this returns List<AgentAvailability>
    List<AgentAvailability> findByAgentId(String agentId);
}
