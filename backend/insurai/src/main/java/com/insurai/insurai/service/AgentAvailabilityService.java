package com.insurai.insurai.service;

import com.insurai.insurai.dto.AgentAvailabilityRequest;
import com.insurai.insurai.model.AgentAvailability;
import com.insurai.insurai.model.AgentAvailabilityBreak;
import com.insurai.insurai.repository.AgentAvailabilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentAvailabilityService {

    private final AgentAvailabilityRepository availabilityRepository;

    public AgentAvailabilityService(AgentAvailabilityRepository availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }

    @Transactional
    public AgentAvailability saveAvailability(AgentAvailabilityRequest request) {
        AgentAvailability availability = new AgentAvailability();
        availability.setAgentId(request.getAgentId());
        availability.setAvailabilityDate(request.getAvailabilityDate());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setRecurring(request.getRecurring());
        availability.setStatus(request.getStatus());
        availability.setNotes(request.getNotes());

        if (request.getBreaks() != null) {
            availability.setBreaks(
                request.getBreaks().stream().map(b -> {
                    AgentAvailabilityBreak brk = new AgentAvailabilityBreak();
                    brk.setBreakStart(b.getBreakStart());
                    brk.setBreakEnd(b.getBreakEnd());
                    brk.setAvailability(availability);
                    return brk;
                }).collect(Collectors.toList())
            );
        }

        return availabilityRepository.save(availability);
    }

    public List<AgentAvailability> getAvailabilityByAgentId(String agentId) {
        return availabilityRepository.findByAgentId(agentId);
    }
}
