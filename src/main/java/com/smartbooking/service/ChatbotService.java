package com.smartbooking.service;

import com.smartbooking.dto.ChatResponseDto;
import com.smartbooking.dto.ServiceResponseDto;
import com.smartbooking.model.ServiceCategory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ChatbotService {
    private final ServiceCatalogService serviceCatalogService;
    private final ObjectMapper objectMapper;
    private final RestClient openAiClient;
    private final RestClient geminiClient;

    @Value("${openai.api-key:}")
    private String openAiApiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String openAiModel;

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-2.0-flash}")
    private String geminiModel;

    public ChatbotService(ServiceCatalogService serviceCatalogService, ObjectMapper objectMapper) {
        this.serviceCatalogService = serviceCatalogService;
        this.objectMapper = objectMapper;
        this.openAiClient = RestClient.builder().baseUrl("https://api.openai.com/v1").build();
        this.geminiClient = RestClient.builder().baseUrl("https://generativelanguage.googleapis.com/v1beta").build();
    }

    public ChatResponseDto respond(String message) {
        if (message == null || message.trim().isBlank()) {
            return new ChatResponseDto(
                "GREETING",
                "Hello! I am your SmartServe AI concierge. How can I help you today? You can ask about our local services, how to book, fraud risk detection, payments, or demo logins.",
                List.of(),
                List.of("What services are available?", "How does booking work?", "What are the demo logins?", "How does fraud detection work?")
            );
        }

        String normalized = message.toLowerCase(Locale.ROOT).trim();

        // 1. Try Gemini API if key is present
        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            String aiReply = askGemini(message);
            if (aiReply != null && !aiReply.isBlank()) {
                List<ServiceResponseDto> candidates = serviceCatalogService.semanticSearch(message).stream().limit(4).toList();
                return new ChatResponseDto("AI_ASSISTANT", aiReply, candidates, getDefaultSuggestions());
            }
        }

        // 2. Try OpenAI API if key is present
        if (openAiApiKey != null && !openAiApiKey.isBlank()) {
            String aiReply = askOpenAi(message);
            if (aiReply != null && !aiReply.isBlank()) {
                List<ServiceResponseDto> candidates = serviceCatalogService.semanticSearch(message).stream().limit(4).toList();
                return new ChatResponseDto("AI_ASSISTANT", aiReply, candidates, getDefaultSuggestions());
            }
        }

        // 3. Built-in Comprehensive Smart Knowledge & Rule Engine (Works 100% offline / without API keys)
        return generateKnowledgeResponse(normalized, message);
    }

    private ChatResponseDto generateKnowledgeResponse(String q, String originalQuery) {
        // --- GREETING & IDENTITY ---
        if (matchesAny(q, "hi", "hello", "hey", "who are you", "what are you", "introduce")) {
            return new ChatResponseDto(
                "GREETING",
                "Hello! 👋 I'm **SmartServe AI Assistant**. I can help you discover verified local services (cleaning, electrical, plumbing, tutoring, painting), guide you through instant bookings, explain our fraud detection and recommendation engines, or provide platform details.",
                List.of(),
                List.of("Show available services", "How do I book a service?", "What demo accounts can I use?", "How does fraud scoring work?")
            );
        }

        // --- ABOUT SMARTSERVE / PLATFORM OVERVIEW ---
        if (matchesAny(q, "what is smartserve", "about smartserve", "about this web", "about this project", "what does this app do", "features", "overview", "what is this platform")) {
            return new ChatResponseDto(
                "PLATFORM_INFO",
                "✨ **SmartServe AI** is an intelligent full-stack local service booking marketplace.\n\n"
                    + "Key features include:\n"
                    + "• **Service Discovery:** Verified local service catalogue with real ratings, prices, and provider availability.\n"
                    + "• **Smart Booking:** Real-time scheduling with duration and conflict checks.\n"
                    + "• **AI Fraud Detection:** Automated 0-100 risk scoring evaluating velocity, repeat patterns, and flagged history.\n"
                    + "• **Hybrid Recommendations:** Scoring based on collaborative filtering, category affinity, rating, and freshness.\n"
                    + "• **Real-time Updates:** Live STOMP/WebSocket booking updates.\n"
                    + "• **Admin Analytics:** Interactive charts for booking trends, top categories, and fraud risk monitoring.",
                List.of(),
                List.of("How to book a service?", "Show top services", "Tell me about fraud detection", "What tech stack is used?")
            );
        }

        // --- DEMO ACCOUNTS & LOGIN CREDENTIALS ---
        if (matchesAny(q, "login", "credentials", "password", "demo account", "sign in", "admin login", "test account", "user account", "how to log in")) {
            return new ChatResponseDto(
                "CREDENTIALS",
                "🔑 **SmartServe Demo Credentials:**\n\n"
                    + "👤 **Customer Account:**\n"
                    + "• Email: `user@smartserve.ai`\n"
                    + "• Password: `password123`\n\n"
                    + "👤 **Alternative User:**\n"
                    + "• Email: `rohan@smartserve.ai`\n"
                    + "• Password: `password123`\n\n"
                    + "🛡️ **Administrator Account:**\n"
                    + "• Email: `admin@smartserve.ai`\n"
                    + "• Password: `admin123`\n\n"
                    + "You can also register a brand new account using the **Sign up** page at `/signup`.",
                List.of(),
                List.of("Go to login page", "What services can I book?", "What can an admin do?")
            );
        }

        // --- HOW TO BOOK / BOOKING PROCESS ---
        if (matchesAny(q, "how to book", "how do i book", "booking process", "book a service", "how booking works", "schedule a service")) {
            List<ServiceResponseDto> topServices = serviceCatalogService.getServices(null).stream().limit(3).toList();
            return new ChatResponseDto(
                "BOOKING_GUIDE",
                "📅 **How to book a service on SmartServe:**\n\n"
                    + "1. **Log in** to your account (e.g. `user@smartserve.ai`).\n"
                    + "2. Go to the **Dashboard** to browse available services.\n"
                    + "3. Click **Book Now** on any service card.\n"
                    + "4. Pick your preferred **Schedule Date & Time** and **Duration** (e.g. 60 mins).\n"
                    + "5. Confirm the booking — our payment simulator and AI fraud engine will instantly verify your request!\n"
                    + "6. Your confirmed booking will immediately appear under **Your bookings** with live status updates.",
                topServices,
                List.of("Show available services", "How does fraud detection work?", "Can I cancel a booking?")
            );
        }

        // --- FRAUD DETECTION & RISK SCORING ---
        if (matchesAny(q, "fraud", "risk score", "flagged", "security", "why flagged", "fraud detection", "safety")) {
            return new ChatResponseDto(
                "FRAUD_INFO",
                "🛡️ **SmartServe AI Fraud Detection Engine:**\n\n"
                    + "Every booking is analyzed before confirmation by `FraudDetectionService`:\n"
                    + "• **Velocity Check:** Tracks bookings per minute and bookings in the last 1 hour.\n"
                    + "• **Pattern Analysis:** Flags repeated rapid booking attempts for the same service or category.\n"
                    + "• **Historical Risk:** Accounts for past user flagged events.\n"
                    + "• **Risk Scoring (0–100):** If score exceeds the threshold (70+), the booking is marked **`FLAGGED`** for admin review and holds payment.\n"
                    + "• Clean bookings pass with status **`CONFIRMED`** and `paymentStatus = SUCCESS`.",
                List.of(),
                List.of("Show top services", "How do recommendations work?", "What can an admin do?")
            );
        }

        // --- AI RECOMMENDATIONS ---
        if (matchesAny(q, "recommend", "how recommendations work", "ai logic", "collaborative filtering", "affinity", "personalization")) {
            List<ServiceResponseDto> recs = serviceCatalogService.getServices(null).stream()
                .sorted(Comparator.comparingDouble(ServiceResponseDto::getAverageRating).reversed())
                .limit(3)
                .toList();
            return new ChatResponseDto(
                "RECOMMENDATION_INFO",
                "🤖 **Personalized Recommendation Algorithm:**\n\n"
                    + "The platform combines 6 key weighted signals:\n"
                    + "1. **Collaborative Filtering (34%):** Suggests services that other users with similar booking tastes booked.\n"
                    + "2. **Category Affinity (18%):** Boosts services in categories you use most frequently.\n"
                    + "3. **Rating Score (20%):** Higher customer star ratings get precedence.\n"
                    + "4. **Popularity (16%):** Frequently booked services get rewarded.\n"
                    + "5. **Behavior History (10%):** Tracks interactions stored in `user_behavior_history`.\n"
                    + "6. **Freshness (2%):** Boosts newly added platform services.",
                recs,
                List.of("Show top services", "How to book a service?", "What are the demo logins?")
            );
        }

        // --- PAYMENT & PRICING ---
        if (matchesAny(q, "payment", "pay", "stripe", "price", "cost", "pricing", "how much", "refund")) {
            return new ChatResponseDto(
                "PAYMENT_INFO",
                "💳 **Payment & Pricing Details:**\n\n"
                    + "• **Simulated Instant Payment:** Handled via `PaymentService` — normal bookings receive immediate `SUCCESS` with a mock transaction ID.\n"
                    + "• **Stripe Ready:** Stripe Java SDK is integrated for production credit/debit card processing.\n"
                    + "• **Transparent Pricing:**\n"
                    + "  - Math Tutoring: **₹499**\n"
                    + "  - Plumbing Maintenance: **₹799**\n"
                    + "  - Electrical Repair: **₹899**\n"
                    + "  - Deep Home Cleaning: **₹1,299**\n"
                    + "  - Wall Painting Refresh: **₹2,499**",
                List.of(),
                List.of("Show all services", "How do I book?", "Can I cancel a booking?")
            );
        }

        // --- CANCELLATION ---
        if (matchesAny(q, "cancel", "cancellation", "reschedule", "delete booking")) {
            return new ChatResponseDto(
                "CANCELLATION_INFO",
                "❌ **Booking Cancellation:**\n\n"
                    + "• You can cancel any of your active bookings directly from the **Dashboard** under **Your bookings**.\n"
                    + "• Simply click the **Cancel** button on your booking card.\n"
                    + "• The booking status will update to `CANCELLED` and provider schedule availability is released.",
                List.of(),
                List.of("How to book a service?", "Show available services", "What are the demo logins?")
            );
        }

        // --- PROVIDERS ---
        if (matchesAny(q, "provider", "who are the providers", "sparkle", "urban fix", "bright minds", "technician", "availability")) {
            return new ChatResponseDto(
                "PROVIDER_INFO",
                "👷 **Registered Service Providers:**\n\n"
                    + "1. **Sparkle Home Care** — Specializes in Home Cleaning & Wall Painting (Phone: 9876543210)\n"
                    + "2. **Urban Fix Experts** — Certified technicians for Electrical Repair & Plumbing (Phone: 9876501234)\n"
                    + "3. **Bright Minds Tutors** — Experienced educators offering 1-on-1 tutoring (Phone: 9876512345)\n\n"
                    + "Providers or Admins can toggle availability ('Mark busy' / 'Mark free') on the dashboard in real-time.",
                List.of(),
                List.of("Show top services", "How to book a service?", "What are the demo logins?")
            );
        }

        // --- ADMIN & ANALYTICS ---
        if (matchesAny(q, "admin", "analytics", "graph", "metric", "chart", "admin dashboard")) {
            return new ChatResponseDto(
                "ADMIN_INFO",
                "📊 **Admin Capabilities & Analytics:**\n\n"
                    + "When logged in as an Admin (`admin@smartserve.ai`):\n"
                    + "• Total user, service, and booking metrics.\n"
                    + "• **Bookings per Day:** 7-10 day trend charts.\n"
                    + "• **Top Categories:** Distribution breakdown of platform demands.\n"
                    + "• **Fraud Trends:** Real-time visibility into flagged bookings.\n"
                    + "• REST endpoints: `/api/admin/analytics`, `/api/admin/analytics/top-categories`, `/api/admin/analytics/fraud-trends`.",
                List.of(),
                List.of("What are the demo logins?", "What tech stack is used?", "Show top services")
            );
        }

        // --- TECH STACK & DATABASE ---
        if (matchesAny(q, "tech stack", "technology", "technologies", "architecture", "database", "mysql", "backend", "frontend", "nextjs", "spring boot", "how it is built")) {
            return new ChatResponseDto(
                "TECH_INFO",
                "🛠️ **SmartServe AI Tech Stack:**\n\n"
                    + "• **Backend:** Spring Boot 3.5.0, Java 17, Spring Data JPA, Spring Security, Spring WebSocket (STOMP).\n"
                    + "• **Database:** MySQL 8 (`smart_serve` database) running on port 3306.\n"
                    + "• **Authentication:** Stateless JWT with refresh token rotation.\n"
                    + "• **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts.\n"
                    + "• **API Documentation:** OpenAPI / Swagger UI at `http://localhost:8080/swagger-ui/index.html`.\n"
                    + "• **Cache & Queue:** Redis & RabbitMQ ready for horizontal scaling.",
                List.of(),
                List.of("Show available services", "What are the demo logins?", "How does fraud detection work?")
            );
        }

        // --- SWAGGER / API ---
        if (matchesAny(q, "api", "swagger", "endpoint", "documentation", "docs", "curl", "postman")) {
            return new ChatResponseDto(
                "API_INFO",
                "📖 **API & Documentation:**\n\n"
                    + "• **Swagger UI:** Accessible at `http://localhost:8080/swagger-ui/index.html`\n"
                    + "• **Key Endpoints:**\n"
                    + "  - `POST /api/auth/login` — Authenticate and receive JWT\n"
                    + "  - `GET /api/services` — List marketplace services\n"
                    + "  - `POST /api/bookings` — Create a scheduled booking\n"
                    + "  - `GET /api/recommendations/me` — Personalized AI recommendations\n"
                    + "  - `POST /api/chat` — Assistant endpoint",
                List.of(),
                List.of("What are the demo logins?", "Show available services", "How to book a service?")
            );
        }

        // --- CATEGORY SEARCH OR SPECIFIC SERVICE INQUIRIES ---
        ServiceCategory category = inferCategory(q);
        if (category != null || matchesAny(q, "clean", "electric", "plumb", "tutor", "paint", "beauty", "repair", "service", "book")) {
            List<ServiceResponseDto> matches = category != null
                ? serviceCatalogService.getServices(category)
                : serviceCatalogService.semanticSearch(originalQuery).stream().limit(5).toList();

            if (!matches.isEmpty()) {
                String catName = category != null ? category.name().replace('_', ' ') : "matching";
                return new ChatResponseDto(
                    "SERVICE_SEARCH",
                    "Here are the top **" + catName + "** services available on SmartServe. Click any service to view details or book:",
                    matches,
                    List.of("How do I book one of these?", "Check pricing", "How does fraud check work?")
                );
            }
        }

        // --- TOP / POPULAR SERVICES ---
        if (matchesAny(q, "top", "popular", "best", "highest rated", "most booked")) {
            List<ServiceResponseDto> top = serviceCatalogService.getServices(null).stream()
                .sorted(Comparator.comparingLong(ServiceResponseDto::getBookingCount).reversed()
                    .thenComparing(Comparator.comparingDouble(ServiceResponseDto::getAverageRating).reversed()))
                .limit(4)
                .toList();
            return new ChatResponseDto(
                "TOP_SERVICES",
                "Here are our highest-rated and most booked local services on the platform:",
                top,
                List.of("How to book a service?", "What are the prices?", "How do recommendations work?")
            );
        }

        // --- SEMANTIC SEARCH FALLBACK ---
        List<ServiceResponseDto> searchResults = serviceCatalogService.semanticSearch(originalQuery).stream().limit(3).toList();
        if (!searchResults.isEmpty()) {
            return new ChatResponseDto(
                "SERVICE_SEARCH",
                "I found these relevant services based on your question:",
                searchResults,
                List.of("How to book a service?", "What demo accounts can I use?", "What is SmartServe?")
            );
        }

        // --- DEFAULT COMPREHENSIVE FALLBACK ---
        List<ServiceResponseDto> defaultServices = serviceCatalogService.getServices(null).stream().limit(3).toList();
        return new ChatResponseDto(
            "GENERAL_HELP",
            "I'm here to help with anything on **SmartServe AI**! You can ask me about:\n\n"
                + "• **Services:** 'Show electrician services', 'Cleaning prices', 'Top rated'\n"
                + "• **Booking:** 'How do I book a service?', 'Can I cancel?'\n"
                + "• **AI Features:** 'How does fraud detection work?', 'Explain recommendations'\n"
                + "• **Platform:** 'What are the demo logins?', 'Tell me about the tech stack'",
            defaultServices,
            List.of("Show available services", "How does booking work?", "What are demo credentials?", "Explain fraud detection")
        );
    }

    private boolean matchesAny(String query, String... targets) {
        for (String target : targets) {
            if (query.contains(target.toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private List<String> getDefaultSuggestions() {
        return List.of(
            "Show available services",
            "How does booking work?",
            "What demo accounts can I use?",
            "How does fraud scoring work?"
        );
    }

    private String askOpenAi(String message) {
        try {
            String context = buildServiceContext(message);

            Map<String, Object> payload = Map.of(
                "model", openAiModel,
                "messages", List.of(
                    Map.of("role", "system", "content", "You are the SmartServe AI concierge assistant. Give polite, well-formatted answers about SmartServe services, bookings, fraud detection, and accounts. Mention services when relevant."),
                    Map.of("role", "user", "content", "User query: " + message + "\n\nPlatform context: " + context)
                ),
                "temperature", 0.4
            );

            @SuppressWarnings("null")
            String raw = openAiClient.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + openAiApiKey)
                .body(payload)
                .retrieve()
                .body(String.class);

            JsonNode root = objectMapper.readTree(raw);
            return root.path("choices").path(0).path("message").path("content").asText("");
        } catch (Exception ignored) {
            return null;
        }
    }

    private String askGemini(String message) {
        try {
            String context = buildServiceContext(message);

            Map<String, Object> payload = Map.of(
                "systemInstruction", Map.of(
                    "parts", List.of(Map.of(
                        "text",
                        "You are SmartServe AI Concierge. Give concise, well-structured answers about local services, booking steps, fraud detection, and account details. Be helpful and friendly."
                    ))
                ),
                "contents", List.of(Map.of(
                    "role", "user",
                    "parts", List.of(Map.of(
                        "text",
                        "User query: " + message + "\n\nAvailable services context: " + context
                    ))
                )),
                "generationConfig", Map.of(
                    "temperature", 0.4,
                    "maxOutputTokens", 350
                )
            );

            @SuppressWarnings("null")
            String raw = geminiClient.post()
                .uri(uriBuilder -> uriBuilder
                    .path("/models/{model}:generateContent")
                    .queryParam("key", geminiApiKey)
                    .build(geminiModel))
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(String.class);

            JsonNode root = objectMapper.readTree(raw);
            JsonNode parts = root.path("candidates").path(0).path("content").path("parts");
            if (parts.isArray() && !parts.isEmpty()) {
                return parts.path(0).path("text").asText("");
            }
            return null;
        } catch (Exception ignored) {
            return null;
        }
    }

    private String buildServiceContext(String message) {
        List<ServiceResponseDto> contextServices = serviceCatalogService.semanticSearch(message).stream().limit(4).toList();
        if (contextServices.isEmpty()) {
            contextServices = serviceCatalogService.getServices(null).stream().limit(4).toList();
        }
        return contextServices.stream()
            .map(service -> service.getTitle() + " (Category: " + service.getCategory() + ", Provider: " + service.getProviderName() + ", Price: ₹" + service.getPrice() + ", Rating: " + service.getAverageRating() + "★)")
            .reduce((left, right) -> left + "; " + right)
            .orElse("Platform has Home Cleaning, Electrical Repair, Plumbing, Tutoring, and Wall Painting.");
    }

    private ServiceCategory inferCategory(String text) {
        if (text.contains("electric") || text.contains("wiring") || text.contains("fan") || text.contains("switchboard")) {
            return ServiceCategory.ELECTRICAL;
        }
        if (text.contains("plumb") || text.contains("leak") || text.contains("tap") || text.contains("pipe") || text.contains("drain")) {
            return ServiceCategory.PLUMBING;
        }
        if (text.contains("clean") || text.contains("sanitize") || text.contains("dust") || text.contains("mop")) {
            return ServiceCategory.HOME_CLEANING;
        }
        if (text.contains("tutor") || text.contains("math") || text.contains("study") || text.contains("teach") || text.contains("learn")) {
            return ServiceCategory.TUTORING;
        }
        if (text.contains("paint") || text.contains("color") || text.contains("wall")) {
            return ServiceCategory.PAINTING;
        }
        if (text.contains("beauty") || text.contains("salon") || text.contains("hair")) {
            return ServiceCategory.BEAUTY;
        }
        if (text.contains("computer") || text.contains("wifi") || text.contains("it support") || text.contains("laptop")) {
            return ServiceCategory.IT_SUPPORT;
        }
        return null;
    }
}
