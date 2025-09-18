package com.insurai.insurai.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.insurai.insurai.model.AgentAvailability;
import com.insurai.insurai.model.Claim;
import com.insurai.insurai.model.Policy;
import com.insurai.insurai.model.User;
import com.insurai.insurai.repository.AgentAvailabilityRepository;
import com.insurai.insurai.repository.ClaimRepository;
import com.insurai.insurai.repository.PolicyRepository;
import com.insurai.insurai.repository.UserRepository;

@Service
public class VoiceQueryService {

    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;
    private final AgentAvailabilityRepository agentAvailabilityRepository;
    private final WebClient webClient;
    private final String apiKey;

    public VoiceQueryService(PolicyRepository policyRepository, ClaimRepository claimRepository,
                             UserRepository userRepository, AgentAvailabilityRepository agentAvailabilityRepository,
                             @Value("${gemini.api.key:}") String apiKey) {
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
        this.agentAvailabilityRepository = agentAvailabilityRepository;
        this.apiKey = apiKey;
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public String processQuery(String query, String userId) {
        if (apiKey == null || apiKey.isEmpty()) {
            // No API key, use fallback
            return fallbackProcessQuery(query, userId);
        }

        try {
            // Fetch user data
            List<Policy> policies = policyRepository.findByUserId(userId);
            List<Claim> claims = claimRepository.findByUserId(userId);
            User user = userRepository.findById(userId).orElse(null);
            List<AgentAvailability> agents = agentAvailabilityRepository.findAll();

            // Build context
            StringBuilder context = new StringBuilder();
            if (user != null) {
                String name = (user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : "").trim();
                context.append("User Details:\n");
                context.append("- Name: ").append(name)
                        .append(", Email: ").append(user.getEmail())
                        .append(", Role: ").append(user.getCategory())
                        .append("\n\n");
            }

            context.append("User Policies:\n");
            if (policies.isEmpty()) {
                context.append("No policies found.\n");
            } else {
                for (Policy policy : policies) {
                    context.append("- Policy ID: ").append(policy.getPolicyId())
                            .append(", Type: ").append(policy.getType())
                            .append(", Status: ").append(policy.getStatus())
                            .append(", Premium: $").append(policy.getPremium())
                            .append("\n");
                }
            }

            context.append("\nUser Claims:\n");
            if (claims.isEmpty()) {
                context.append("No claims found.\n");
            } else {
                for (Claim claim : claims) {
                    context.append("- Claim ID: ").append(claim.getClaimId())
                            .append(", Description: ").append(claim.getDescription())
                            .append(", Status: ").append(claim.getStatus())
                            .append(", Amount: $").append(claim.getAmount())
                            .append("\n");
                }
            }

            context.append("\nAvailable Agents:\n");
            if (agents.isEmpty()) {
                context.append("No agents available.\n");
            } else {
                for (AgentAvailability agent : agents) {
                    context.append("- Availability ID: ").append(agent.getAvailabilityId())
                            .append(", Agent ID: ").append(agent.getAgentId())
                            .append(", Status: ").append(agent.getStatus())
                            .append(", Notes: ").append(agent.getNotes() != null ? agent.getNotes() : "None")
                            .append("\n");
                }
            }

            // Create prompt for Gemini
            String prompt = "You are an AI assistant for an insurance company called InsurAI. " +
                    "You must restrict your responses to insurance-related topics only, such as policies, claims, agents, and general insurance advice. " +
                    "Do not answer questions outside of this scope. " +
                    "Answer the user's query based on the following user data:\n\n" +
                    context.toString() +
                    "\nUser Query: " + query +
                    "\n\nProvide a helpful, concise response. If the query is about policies, claims, or agents, reference the data above. " +
                    "If it's a general insurance question, answer helpfully. For actions like generating receipts or PDFs, confirm the action. " +
                    "If the query is not related to insurance, politely decline to answer.";

            // Prepare request body
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of(
                            "parts", List.of(Map.of(
                                    "text", prompt
                            ))
                    )),
                    "generationConfig", Map.of(
                            "temperature", 0.7,
                            "maxOutputTokens", 1024
                    )
            );

            // Call Gemini API
            Map response = webClient.post()
                    .uri("/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("candidates")) {
                List candidates = (List) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    List parts = (List) content.get("parts");
                    if (!parts.isEmpty()) {
                        Map part = (Map) parts.get(0);
                        return (String) part.get("text");
                    }
                }
            }

            // If parsing fails, fallback
            return fallbackProcessQuery(query, userId);

        } catch (Exception e) {
            // Fallback to basic processing if Gemini fails
            return fallbackProcessQuery(query, userId);
        }
    }

    private String fallbackProcessQuery(String query, String userId) {
        String lowerQuery = query.toLowerCase();
        String[] tokens = lowerQuery.split("\\s+");

        // Enhanced intent detection using tokenization
        if (containsAny(tokens, "help", "commands", "options", "list")) {
            return "Available commands: /generate-receipt (Generate a payment receipt), /policy (Get policy details), /claim-status (Check claim status), /pdf (Generate a PDF of documents), /help (List all available commands)";
        } else if (containsAny(tokens, "receipt", "generate", "payment", "bill")) {
            return "✅ Receipt generated. [📄 receipt.pdf]";
        } else if (containsAny(tokens, "policy", "details", "information")) {
            List<Policy> policies = policyRepository.findByUserId(userId);
            if (policies.isEmpty()) {
                return "No policies found for your account.";
            }
            StringBuilder response = new StringBuilder("📑 Your policies:\n");
            for (Policy policy : policies) {
                response.append("Policy ID: ").append(policy.getPolicyId())
                        .append(", Type: ").append(policy.getType())
                        .append(", Status: ").append(policy.getStatus())
                        .append(", Premium: $").append(policy.getPremium())
                        .append("\n");
            }
            return response.toString();
        } else if (containsAny(tokens, "claim", "status")) {
            List<Claim> claims = claimRepository.findByUserId(userId);
            if (claims.isEmpty()) {
                return "No claims found for your account.";
            }
            StringBuilder response = new StringBuilder("📋 Your claims:\n");
            for (Claim claim : claims) {
                response.append("Claim ID: ").append(claim.getClaimId())
                        .append(", Description: ").append(claim.getDescription())
                        .append(", Status: ").append(claim.getStatus())
                        .append(", Amount: $").append(claim.getAmount())
                        .append("\n");
            }
            return response.toString();
        } else if (containsAny(tokens, "pdf", "document", "file", "download")) {
            return "📄 PDF generated successfully.";
        } else {
            return "I'm sorry, I didn't understand that. Type /help for available commands.";
        }
    }

    private boolean containsAny(String[] tokens, String... keywords) {
        for (String token : tokens) {
            for (String keyword : keywords) {
                if (token.equals(keyword)) {
                    return true;
                }
            }
        }
        return false;
    }
}
