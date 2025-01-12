// src/main/java/com/jpa/sql/leetcodetracker/backend/repository/ProblemRepository.java
package com.jpa.sql.leetcodetracker.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.jpa.sql.leetcodetracker.backend.entity.Problem;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByDifficulty(String difficulty);
    List<Problem> findByTopic(String topic);
    List<Problem> findBySolved(boolean solved);
    
    @Query("SELECT p FROM Problem p WHERE DATE(p.date) = DATE(?1)")
    List<Problem> findByDate(LocalDateTime date);
    
    @Query("SELECT p FROM Problem p WHERE p.date BETWEEN ?1 AND ?2")
    List<Problem> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT p FROM Problem p WHERE p.date > ?1")
    List<Problem> findByDateAfter(LocalDateTime date);  // Added this method
}