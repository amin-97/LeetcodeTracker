package com.jpa.sql.leetcodetracker.backend.dto;

public class ChatResponse {
    private String content;
    private String type;

    public ChatResponse() {}

    public ChatResponse(String content, String type) {
        this.content = content;
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "ChatResponse{" +
                "content='" + content + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}