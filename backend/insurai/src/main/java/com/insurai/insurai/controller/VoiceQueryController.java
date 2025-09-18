package com.insurai.insurai.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurai.insurai.service.VoiceQueryService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class VoiceQueryController {
    private final VoiceQueryService voiceQueryService;

    public VoiceQueryController(VoiceQueryService voiceQueryService) {
        this.voiceQueryService = voiceQueryService;
    }

    @PostMapping("/voice-query")
    public ResponseEntity<?> processVoiceQuery(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        String userId = request.get("userId");
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Query is required");
        }
        if (userId == null || userId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("User ID is required");
        }
        String response = voiceQueryService.processQuery(query, userId);
        return ResponseEntity.ok(Map.of("response", response));
    }
}
