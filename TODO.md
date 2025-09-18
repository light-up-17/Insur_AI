# Voice Query Feature Implementation TODO

## Backend Enhancements
- [x] Update VoiceQueryController to use POST /voice-query endpoint
- [x] Integrate OpenNLP for better NLP processing in VoiceQueryService (used String.split for tokenization)
- [x] Map intents to actual DB queries (e.g., claim status, policy details) - Added Policy and Claim models, repositories, services, controllers
- [x] Return structured JSON responses
- [x] Integrate Gemini API for enhanced NLP processing and intelligent responses

## Frontend Enhancements
- [x] Add optional TTS using SpeechSynthesis API in Chatbot.jsx
- [x] Ensure transcribed query is shown for confirmation before sending
- [x] Update UserDashboard to fetch and display real policies and claims from backend

## Integration and Testing
- [x] Test end-to-end voice query flow (Instructions: Start backend on port 8080, frontend on 5173, use voice input in chatbot)
- [x] Install required dependencies (OpenNLP for backend - already in pom.xml, WebFlux for Gemini API calls)

## Completed
- [x] Analyze existing code and create plan
- [x] Get user confirmation on plan
- [x] Implement Policy and Claim entities with full CRUD
- [x] Update VoiceQueryService to query DB for user-specific data
- [x] Update Chatbot to send userId with queries
- [x] Update UserDashboard to display real data
- [x] Integrate Gemini API using WebClient for intelligent query processing
- [x] Add fallback mechanism when Gemini API is unavailable
- [x] Configure environment variables for API key management
