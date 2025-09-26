package com.insurai.insurai.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurai.insurai.dto.AgentAvailabilityRequest;
import com.insurai.insurai.dto.BookedRequestDTO;
import com.insurai.insurai.dto.OnlineAgentDTO;
import com.insurai.insurai.model.AgentAvailability;
import com.insurai.insurai.repository.AgentAvailabilityRepository;
import com.insurai.insurai.service.AgentAvailabilityService;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentAvailabilityController {

    private final AgentAvailabilityService service;

    @Autowired
    private AgentAvailabilityRepository availabilityRepository;

    public AgentAvailabilityController(AgentAvailabilityService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> createAvailability(@RequestBody AgentAvailabilityRequest request) {
        AgentAvailability slot = new AgentAvailability();
        // ... set other fields ...
        slot.setStatus("Available"); // Always set to Available on creation
        return ResponseEntity.ok(service.saveAvailability(request));
    }

    @GetMapping("/{agentId}")
    public ResponseEntity<List<AgentAvailability>> getAvailability(@PathVariable String agentId) {
        return ResponseEntity.ok(service.getAvailabilityByAgentId(agentId));
    }

    @PutMapping("/{id}/book")
    public ResponseEntity<?> bookSlot(@PathVariable Integer id, @RequestBody Map<String, Object> payload) {
        if (payload.containsKey("userId")) {
            String userId = payload.get("userId").toString();
            boolean success = service.bookSlot(id, userId);
            if (success) {
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.notFound().build();
    }

    // UPDATED ENDPOINT: Get all online agents (status = "Available") with full name
    @GetMapping("/online")
    public ResponseEntity<List<OnlineAgentDTO>> getOnlineAgents() {
        return ResponseEntity.ok(service.getOnlineAgents());
    }

    @GetMapping("/booked/{agentId}")
    public ResponseEntity<List<BookedRequestDTO>> getBookedRequests(@PathVariable String agentId) {
        return ResponseEntity.ok(service.getBookedRequestsByAgentId(agentId));
    }
}
