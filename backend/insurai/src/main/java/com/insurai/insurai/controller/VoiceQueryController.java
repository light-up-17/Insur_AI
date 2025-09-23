package com.insurai.insurai.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurai.insurai.model.User;
import com.insurai.insurai.repository.UserRepository;
import com.insurai.insurai.service.VoiceQueryService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class VoiceQueryController {
    private final VoiceQueryService voiceQueryService;
    private final UserRepository userRepository;

    public VoiceQueryController(VoiceQueryService voiceQueryService, UserRepository userRepository) {
        this.voiceQueryService = voiceQueryService;
        this.userRepository = userRepository;
    }

    @PostMapping("/voice-query")
    public ResponseEntity<?> processVoiceQuery(@RequestBody Map<String, String> request) {
        // Extract user information from JWT token instead of request body
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }

        String email = authentication.getName();
        if (email == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid authentication"));
        }

        // Get user by email to get the actual user ID
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        User user = userOptional.get();
        String userId = user.getId();

        String query = request.get("query");
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Query is required"));
        }

        try {
            String response = voiceQueryService.processQuery(query, userId);
            return ResponseEntity.ok(Map.of("response", response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error processing query: " + e.getMessage()));
        }
    }
}
