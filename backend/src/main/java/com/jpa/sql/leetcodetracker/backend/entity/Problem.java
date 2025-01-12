// src/main/java/com/jpa/sql/leetcodetracker/backend/entity/Problem.java
package com.jpa.sql.leetcodetracker.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "problems")
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Difficulty is required")
    private String difficulty;

    @NotNull(message = "Date is required")
    private LocalDateTime date;

    @NotBlank(message = "Topic is required")
    private String topic;

    private boolean solved;

    private String notes;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public boolean isSolved() { return solved; }
    public void setSolved(boolean solved) { this.solved = solved; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}