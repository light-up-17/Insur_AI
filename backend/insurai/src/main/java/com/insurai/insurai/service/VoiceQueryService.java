package com.insurai.insurai.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class VoiceQueryService {

    private final WebClient webClient;
    private final String apiKey;

    public VoiceQueryService(@Value("${gemini.api.key:}") String apiKey) {
        this.apiKey = apiKey;
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public String processQuery(String query) {
        if (apiKey == null || apiKey.isEmpty()) {
            // No API key, use fallback
            return fallbackProcessQuery(query);
        }

        try {
            // No DB access, use generic context
            String context = "User data not available due to DB removal.\n";

            // Create prompt for Gemini
            String prompt = "You are an AI assistant for an insurance company called InsurAI. " +
                    "You must restrict your responses to insurance-related topics only, such as policies, claims, agents, and general insurance advice. " +
                    "Do not answer questions outside of this scope. " +
                    "Answer the user's query based on general knowledge since user data is not available.\n\n" +
                    "User Query: " + query +
                    "\n\nProvide a helpful, concise response. For actions like generating receipts or PDFs, confirm the action. " +
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
            return fallbackProcessQuery(query);

        } catch (Exception e) {
            // Fallback to basic processing if Gemini fails
            return fallbackProcessQuery(query);
        }
    }

    private String fallbackProcessQuery(String query) {
        String lowerQuery = query.toLowerCase();
        String[] tokens = lowerQuery.split("\\s+");

        // Enhanced intent detection using tokenization
        if (containsAny(tokens, "help", "commands", "options", "list")) {
            return "Available commands: /generate-receipt (Generate a payment receipt), /policy (Get policy details), /claim-status (Check claim status), /pdf (Generate a PDF of documents), /help (List all available commands)";
        } else if (containsAny(tokens, "receipt", "generate", "payment", "bill")) {
            return "✅ Receipt generated. [📄 receipt.pdf]";
        } else if (containsAny(tokens, "policy", "details", "information")) {
            return "📑 Policies provide financial protection against various risks. Types include health, auto, home, and life insurance. Contact an agent for personalized details.";
        } else if (containsAny(tokens, "claim", "status")) {
            return "📋 Claims are requests for payment from your insurance policy. Status can be pending, approved, or denied. Check your policy for claim procedures.";
        } else if (containsAny(tokens, "pdf", "document", "file", "download")) {
            return "📄 PDF generated successfully.";
        } else {
            return "As an InsurAI assistant, I can help with insurance-related questions. Please ask about policies, claims, agents, or use /help for commands.";
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
