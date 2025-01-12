// src/main/java/com/jpa/sql/leetcodetracker/backend/dto/ProblemAnalytics.java
package com.jpa.sql.leetcodetracker.backend.dto;

import java.util.List;
import java.util.Map;

public class ProblemAnalytics {
    private Map<String, Integer> topicCounts;
    private List<String> weakTopics;
    private List<String> recommendedTopics;

    // Constructors
    public ProblemAnalytics() {}

    public ProblemAnalytics(Map<String, Integer> topicCounts, 
                           List<String> weakTopics, 
                           List<String> recommendedTopics) {
        this.topicCounts = topicCounts;
        this.weakTopics = weakTopics;
        this.recommendedTopics = recommendedTopics;
    }

    // Getters and Setters
    public Map<String, Integer> getTopicCounts() {
        return topicCounts;
    }

    public void setTopicCounts(Map<String, Integer> topicCounts) {
        this.topicCounts = topicCounts;
    }

    public List<String> getWeakTopics() {
        return weakTopics;
    }

    public void setWeakTopics(List<String> weakTopics) {
        this.weakTopics = weakTopics;
    }

    public List<String> getRecommendedTopics() {
        return recommendedTopics;
    }

    public void setRecommendedTopics(List<String> recommendedTopics) {
        this.recommendedTopics = recommendedTopics;
    }
}