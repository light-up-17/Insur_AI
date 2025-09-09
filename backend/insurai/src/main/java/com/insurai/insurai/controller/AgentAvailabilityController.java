package com.insurai.insurai.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurai.insurai.dto.AgentAvailabilityRequest;
import com.insurai.insurai.model.AgentAvailability;
import com.insurai.insurai.service.AgentAvailabilityService;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentAvailabilityController {

    private final AgentAvailabilityService service;

    public AgentAvailabilityController(AgentAvailabilityService service) {
        this.service = service;
    }

    @PostMapping
    public AgentAvailability createAvailability(@RequestBody AgentAvailabilityRequest request) {
        System.out.println("Received: " + request); // For debugging
        return service.saveAvailability(request);
    }

    @GetMapping("/{agentId}")
    public ResponseEntity<List<AgentAvailability>> getAvailability(@PathVariable String agentId) {
        return ResponseEntity.ok(service.getAvailabilityByAgentId(agentId));
    }
}
