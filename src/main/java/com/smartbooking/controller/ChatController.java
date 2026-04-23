package com.smartbooking.controller;

import com.smartbooking.dto.ChatRequestDto;
import com.smartbooking.dto.ChatResponseDto;
import com.smartbooking.service.ChatbotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "AI Chatbot", description = "Natural-language assistant for SmartServe service discovery")
public class ChatController {
    private final ChatbotService chatbotService;

    public ChatController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    @Operation(summary = "Ask the SmartServe AI assistant", description = "Maps phrases like 'book electrician' or 'top services' to service discovery responses.")
    public ResponseEntity<ChatResponseDto> chat(@Valid @RequestBody ChatRequestDto request) {
        return ResponseEntity.ok(chatbotService.respond(request.getMessage()));
    }
}
