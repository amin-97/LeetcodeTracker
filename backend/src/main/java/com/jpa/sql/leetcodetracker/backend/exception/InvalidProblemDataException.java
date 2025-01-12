package com.jpa.sql.leetcodetracker.backend.exception;

public class InvalidProblemDataException extends RuntimeException {
    public InvalidProblemDataException(String message) {
        super(message);
    }
}