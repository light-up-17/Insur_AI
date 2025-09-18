package com.insurai.insurai.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.insurai.insurai.dto.AgentAvailabilityRequest;
import com.insurai.insurai.dto.BookedRequestDTO;
import com.insurai.insurai.dto.OnlineAgentDTO;
import com.insurai.insurai.model.AgentAvailability;
import com.insurai.insurai.model.AgentAvailabilityBreak;
import com.insurai.insurai.model.User;
import com.insurai.insurai.model.UserCategory;
import com.insurai.insurai.repository.AgentAvailabilityRepository;
import com.insurai.insurai.repository.UserRepository;
@Service
public class AgentAvailabilityService {

    private final AgentAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;

    @Autowired
    public AgentAvailabilityService(AgentAvailabilityRepository availabilityRepository, UserRepository userRepository) {
        this.availabilityRepository = availabilityRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AgentAvailability saveAvailability(AgentAvailabilityRequest request) {
        AgentAvailability availability = new AgentAvailability();
        availability.setAgentId(request.getAgentId());
        availability.setAvailabilityDate(request.getAvailabilityDate());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setStatus("Available"); // Always set to Available
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

    public List<BookedRequestDTO> getBookedRequestsByAgentId(String agentId) {
        if (agentId == null || agentId.isEmpty()) {
            return List.of();
        }
        List<AgentAvailability> bookedSlots = availabilityRepository.findByAgentIdAndStatus(agentId, "Booked");
        return bookedSlots.stream().map(slot -> {
            String clientName = "Unknown";
            String email = "N/A";
            String phone = "N/A";
            String clientId = slot.getUserId();

            if (slot.getUserId() != null) {
                User user = userRepository.findById(slot.getUserId()).orElse(null);
                if (user != null) {
                    clientName = user.getFirstName() + " " + user.getLastName();
                    email = user.getEmail();
                    phone = user.getPhone();
                }
            }

            BookedRequestDTO dto = new BookedRequestDTO();
            dto.setAvailabilityId(slot.getAvailabilityId());
            dto.setClientId(clientId);
            dto.setClientName(clientName);
            dto.setEmail(email);
            dto.setPhone(phone);
            dto.setDate(slot.getAvailabilityDate());
            dto.setStartTime(slot.getStartTime());
            dto.setEndTime(slot.getEndTime());
            dto.setStatus(slot.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<OnlineAgentDTO> getOnlineAgents() {
        List<AgentAvailability> onlineAgents = availabilityRepository.findByStatus("Available");
        System.out.println("DEBUG: Found " + onlineAgents.size() + " available agents");
        return onlineAgents.stream().map(agent -> {
            User user = userRepository.findById(agent.getAgentId()).orElse(null);
            if (user == null) {
                System.out.println("DEBUG: No user found for agentId: " + agent.getAgentId());
            } else {
                System.out.println("DEBUG: Found user " + user.getFirstName() + " " + user.getLastName() + " for agentId: " + agent.getAgentId());
            }
            OnlineAgentDTO dto = new OnlineAgentDTO();
            dto.setId(agent.getAvailabilityId().toString());
            dto.setAgentId(agent.getAgentId());
            if (user != null && user.getCategory() == UserCategory.AGENT) {
                dto.setEmail(user.getEmail());
                dto.setFirstName(user.getFirstName());
                dto.setLastName(user.getLastName());
                dto.setPhone(user.getPhone());
                dto.setFullName(user.getFirstName() + " " + user.getLastName());
            } else {
                dto.setFullName(agent.getAgentId());
            }
            dto.setAvailabilityDate(agent.getAvailabilityDate().toString());
            dto.setStartTime(agent.getStartTime().toString());
            dto.setEndTime(agent.getEndTime().toString());
            return dto;
        }).collect(Collectors.toList());
    }
}
