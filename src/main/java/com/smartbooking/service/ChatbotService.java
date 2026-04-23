package com.smartbooking.service;

import com.smartbooking.dto.ChatResponseDto;
import com.smartbooking.dto.ServiceResponseDto;
import com.smartbooking.model.ServiceCategory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
        String normalized = message == null ? "" : message.toLowerCase(Locale.ROOT);

        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            String aiReply = askGemini(message);
            if (aiReply != null && !aiReply.isBlank()) {
                List<ServiceResponseDto> candidates = serviceCatalogService.semanticSearch(message).stream().limit(5).toList();
                return new ChatResponseDto("AI_ASSISTANT", aiReply, candidates);
            }
        }

        if (openAiApiKey != null && !openAiApiKey.isBlank()) {
            String aiReply = askOpenAi(message);
            if (aiReply != null && !aiReply.isBlank()) {
                List<ServiceResponseDto> candidates = serviceCatalogService.semanticSearch(message).stream().limit(5).toList();
                return new ChatResponseDto("AI_ASSISTANT", aiReply, candidates);
            }
        }

        if (normalized.contains("top") || normalized.contains("popular") || normalized.contains("recommend")) {
            List<ServiceResponseDto> services = serviceCatalogService.getServices(null).stream()
                .sorted(Comparator.comparingLong(ServiceResponseDto::getBookingCount).reversed()
                    .thenComparing(Comparator.comparingDouble(ServiceResponseDto::getAverageRating).reversed()))
                .limit(5)
                .toList();
            return new ChatResponseDto("TOP_SERVICES", "These are the strongest services to consider right now.", services);
        }

        ServiceCategory category = inferCategory(normalized);
        if (category != null || normalized.contains("book")) {
            List<ServiceResponseDto> services = serviceCatalogService.getServices(category).stream()
                .sorted(Comparator.comparingDouble(ServiceResponseDto::getAverageRating).reversed())
                .limit(5)
                .toList();
            String response = category == null
                ? "Tell me the service type, and I can narrow this down further."
                : "Here are matching services. Use Book Now in the UI or POST /api/bookings with the service id.";
            return new ChatResponseDto("SERVICE_SEARCH", response, services);
        }

        return new ChatResponseDto("GENERAL_HELP", "Try asking for top services, book electrician, book plumber, cleaning, tutoring, or painting.", List.of());
    }

    private String askOpenAi(String message) {
        try {
            String context = buildServiceContext(message);

            Map<String, Object> payload = Map.of(
                "model", openAiModel,
                "messages", List.of(
                    Map.of("role", "system", "content", "You are SmartServe concierge. Give concise helpful answers and mention relevant services from context when available."),
                    Map.of("role", "user", "content", "User query: " + message + "\n\nRelevant platform services: " + context)
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
                        "You are SmartServe concierge. Give concise helpful answers, mention relevant services from context when available, and be practical."
                    ))
                ),
                "contents", List.of(Map.of(
                    "role", "user",
                    "parts", List.of(Map.of(
                        "text",
                        "User query: " + message + "\n\nRelevant platform services: " + context
                    ))
                )),
                "generationConfig", Map.of(
                    "temperature", 0.4,
                    "maxOutputTokens", 256
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
        List<ServiceResponseDto> contextServices = serviceCatalogService.semanticSearch(message).stream().limit(3).toList();
        return contextServices.stream()
            .map(service -> service.getTitle() + " (" + service.getCategory() + ", rating " + service.getAverageRating() + ")")
            .reduce((left, right) -> left + "; " + right)
            .orElse("No direct matches.");
    }

    private ServiceCategory inferCategory(String text) {
        if (text.contains("electric") || text.contains("wiring") || text.contains("fan")) {
            return ServiceCategory.ELECTRICAL;
        }
        if (text.contains("plumb") || text.contains("leak") || text.contains("tap")) {
            return ServiceCategory.PLUMBING;
        }
        if (text.contains("clean")) {
            return ServiceCategory.HOME_CLEANING;
        }
        if (text.contains("tutor") || text.contains("math") || text.contains("study")) {
            return ServiceCategory.TUTORING;
        }
        if (text.contains("paint")) {
            return ServiceCategory.PAINTING;
        }
        return null;
    }
}
