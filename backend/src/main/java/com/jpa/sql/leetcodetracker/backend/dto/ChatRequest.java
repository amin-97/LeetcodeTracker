package com.jpa.sql.leetcodetracker.backend.dto;

public class ChatRequest {
   private String message;
   private String type;

   public ChatRequest() {}

   public ChatRequest(String message, String type) {
       this.message = message;
       this.type = type;
   }

   public String getMessage() {
       return message;
   }

   public void setMessage(String message) {
       this.message = message;
   }

   public String getType() {
       return type;
   }

   public void setType(String type) {
       this.type = type;
   }

   @Override
   public String toString() {
       return "ChatRequest{" +
               "message='" + message + '\'' + 
               ", type='" + type + '\'' +
               '}';
   }
}