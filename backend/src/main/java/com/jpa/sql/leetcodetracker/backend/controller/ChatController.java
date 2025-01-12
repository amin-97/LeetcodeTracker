// src/main/java/com/jpa/sql/leetcodetracker/backend/controller/ChatController.java
package com.jpa.sql.leetcodetracker.backend.controller;

// import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.jpa.sql.leetcodetracker.backend.service.ChatService;
import com.jpa.sql.leetcodetracker.backend.dto.ChatRequest;
import com.jpa.sql.leetcodetracker.backend.dto.ChatResponse;
import com.jpa.sql.leetcodetracker.backend.dto.ProblemAnalytics;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:4200")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ChatResponse> generateResponse(@RequestBody ChatRequest request) {
        System.out.println("Received request: " + request.getMessage());
        try {
            ChatResponse response = chatService.generateResponse(request);
            System.out.println("Sending response: " + response.getContent());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error processing request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    @PostMapping("/analyze-code")
    public ResponseEntity<ChatResponse> analyzeCode(@RequestBody ChatRequest request) {
        System.out.println("Received code analysis request: " + request.getMessage());
        try {
            ChatResponse response = chatService.analyzeCode(request);
            System.out.println("Sending analysis: " + response.getContent());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error analyzing code: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/recommendations")
    public ResponseEntity<ChatResponse> getRecommendations(@RequestBody ChatRequest request) {
        System.out.println("Received recommendations request: " + request.getMessage());
        try {
            ChatResponse response = chatService.getRecommendations(request);
            System.out.println("Sending recommendations: " + response.getContent());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error getting recommendations: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<ProblemAnalytics> getAnalytics() {
        System.out.println("Received analytics request");
        try {
            ProblemAnalytics analytics = chatService.getProblemAnalytics();
            System.out.println("Sending analytics: " + analytics);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            System.err.println("Error getting analytics: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}