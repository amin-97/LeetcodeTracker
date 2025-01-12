package com.jpa.sql.leetcodetracker.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.jpa.sql.leetcodetracker.backend.dto.ChatRequest;
import com.jpa.sql.leetcodetracker.backend.dto.ChatResponse;
import com.jpa.sql.leetcodetracker.backend.dto.ProblemAnalytics;
import com.jpa.sql.leetcodetracker.backend.repository.ProblemRepository;
import com.jpa.sql.leetcodetracker.backend.entity.Problem;
import com.theokanning.openai.service.OpenAiService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final OpenAiService openAiService;
    private final ProblemRepository problemRepository;

    public ChatService(
        @Value("${openai.api.key}") String apiKey,
        ProblemRepository problemRepository
    ) {
        this.openAiService = new OpenAiService(apiKey, Duration.ofSeconds(30));
        this.problemRepository = problemRepository;
    }

    public ChatResponse generateResponse(ChatRequest request) {
        var chatCompletion = openAiService.createChatCompletion(
            ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(Arrays.asList(
                    new ChatMessage("system", "You are a LeetCode mentor and coding expert. Help users with algorithm problems, provide code analysis, and suggest improvements."),
                    new ChatMessage("user", request.getMessage())
                ))
                .temperature(0.7)
                .maxTokens(500)
                .build()
        );

        ChatResponse response = new ChatResponse();
        response.setContent(chatCompletion.getChoices().get(0).getMessage().getContent());
        response.setType("chat");
        return response;
    }

    public ChatResponse analyzeCode(ChatRequest request) {
        var chatCompletion = openAiService.createChatCompletion(
            ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(Arrays.asList(
                    new ChatMessage("system", """
                        You are a code review expert. Analyze code for:
                        1. Time complexity
                        2. Space complexity
                        3. Optimizations
                        4. Edge cases
                        5. Best practices
                        Be specific and provide examples where relevant.
                        """),
                    new ChatMessage("user", "Analyze this code:\n" + request.getMessage())
                ))
                .temperature(0.7)
                .maxTokens(500)
                .build()
        );

        ChatResponse response = new ChatResponse();
        response.setContent(chatCompletion.getChoices().get(0).getMessage().getContent());
        response.setType("code-analysis");
        return response;
    }

    public ChatResponse getRecommendations(ChatRequest request) {
        var chatCompletion = openAiService.createChatCompletion(
            ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(Arrays.asList(
                    new ChatMessage("system", """
                        You are a LeetCode expert. Provide specific problem recommendations including:
                        1. Problem number and title
                        2. Difficulty level
                        3. Key concepts needed
                        4. Brief problem description
                        Suggest a progression from easier to harder problems.
                        """),
                    new ChatMessage("user", "Suggest problems for: " + request.getMessage())
                ))
                .temperature(0.7)
                .maxTokens(500)
                .build()
        );

        ChatResponse response = new ChatResponse();
        response.setContent(chatCompletion.getChoices().get(0).getMessage().getContent());
        response.setType("analytics");
        return response;
    }

    public ProblemAnalytics getProblemAnalytics() {
        // Get all problems from the last week
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        List<Problem> recentProblems = problemRepository.findByDateAfter(oneWeekAgo);

        // Count topics
        Map<String, Integer> topicCounts = new HashMap<>();
        for (Problem problem : recentProblems) {
            String topic = problem.getTopic();
            topicCounts.put(topic, topicCounts.getOrDefault(topic, 0) + 1);
        }

        // Find weak topics (less practiced)
        double avgCount = topicCounts.values().stream()
            .mapToInt(Integer::intValue)
            .average()
            .orElse(0.0);

        List<String> weakTopics = topicCounts.entrySet().stream()
            .filter(entry -> entry.getValue() < avgCount)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        // Generate recommendations based on weak topics
        List<String> recommendedTopics = generateTopicRecommendations(weakTopics);

        return new ProblemAnalytics(topicCounts, weakTopics, recommendedTopics);
    }

    private List<String> generateTopicRecommendations(List<String> weakTopics) {
        Map<String, List<String>> topicProgressions = new HashMap<>();
        topicProgressions.put("Arrays", Arrays.asList("Two Pointers", "Sliding Window"));
        topicProgressions.put("Strings", Arrays.asList("Two Pointers", "Dynamic Programming"));
        topicProgressions.put("LinkedList", Arrays.asList("Two Pointers", "Fast & Slow Pointers"));
        topicProgressions.put("Trees", Arrays.asList("DFS", "BFS", "Binary Search Trees"));
        topicProgressions.put("Graphs", Arrays.asList("DFS", "BFS", "Topological Sort"));
        topicProgressions.put("DynamicProgramming", Arrays.asList("Memoization", "Tabulation"));
        topicProgressions.put("Backtracking", Arrays.asList("Recursion", "Branch and Bound"));
        topicProgressions.put("HashTable", Arrays.asList("Arrays", "Two Pointers"));
        topicProgressions.put("TwoPointers", Arrays.asList("Sliding Window", "Fast & Slow Pointers"));
        topicProgressions.put("Other", Arrays.asList("Arrays", "Strings", "HashTable"));

        return weakTopics.stream()
            .map(topic -> topicProgressions.getOrDefault(topic, Collections.emptyList()))
            .flatMap(List::stream)
            .distinct()
            .collect(Collectors.toList());
    }
}