// src/main/java/com/jpa/sql/leetcodetracker/backend/controller/ProblemController.java
package com.jpa.sql.leetcodetracker.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.jpa.sql.leetcodetracker.backend.entity.Problem;
import com.jpa.sql.leetcodetracker.backend.repository.ProblemRepository;
import com.jpa.sql.leetcodetracker.backend.exception.ProblemNotFoundException;
import com.jpa.sql.leetcodetracker.backend.exception.InvalidProblemDataException;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class ProblemController {

    @Autowired
    private ProblemRepository problemRepository;

    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        List<Problem> problems = problemRepository.findAll();
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
        Problem problem = problemRepository.findById(id)
            .orElseThrow(() -> new ProblemNotFoundException(id));
        return ResponseEntity.ok(problem);
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<Problem>> getProblemsByDifficulty(@PathVariable String difficulty) {
        List<Problem> problems = problemRepository.findByDifficulty(difficulty);
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/topic/{topic}")
    public ResponseEntity<List<Problem>> getProblemsByTopic(@PathVariable String topic) {
        List<Problem> problems = problemRepository.findByTopic(topic);
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/solved/{solved}")
    public ResponseEntity<List<Problem>> getProblemsBySolved(@PathVariable boolean solved) {
        List<Problem> problems = problemRepository.findBySolved(solved);
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Problem>> getProblemsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<Problem> problems = problemRepository.findByDate(date);
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/date-range")
    public List<Problem> findByDateRange(LocalDateTime start, LocalDateTime end) {
    return problemRepository.findByDateBetween(start, end);
}

    @PostMapping
    public ResponseEntity<Problem> createProblem(@Valid @RequestBody Problem problem) {
        if (problem.getId() != null) {
            throw new InvalidProblemDataException("New problem should not have an ID");
        }
        Problem savedProblem = problemRepository.save(problem);
        return ResponseEntity.ok(savedProblem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Problem> updateProblem(@PathVariable Long id, @Valid @RequestBody Problem problem) {
        if (!problemRepository.existsById(id)) {
            throw new ProblemNotFoundException(id);
        }
        problem.setId(id);
        Problem updatedProblem = problemRepository.save(problem);
        return ResponseEntity.ok(updatedProblem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        if (!problemRepository.existsById(id)) {
            throw new ProblemNotFoundException(id);
        }
        problemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}