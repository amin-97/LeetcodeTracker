import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators'; // Add this

export interface ChatResponse {
  type: 'chat' | 'code-analysis' | 'analytics';
  content: string;
}

export interface ProblemAnalytics {
  topicCounts: { [key: string]: number };
  weakTopics: string[];
  recommendedTopics: string[];
}

@Injectable({
  providedIn: 'root',
})
export class LeetCodeChatService {
  private apiUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) {}

  // src/app/components/leetcode-calendar/services/leetcode-chat.service.ts
  public generateResponse(message: string): Observable<ChatResponse> {
    console.log('Sending request to:', `${this.apiUrl}/generate`);
    console.log('Request payload:', { message, type: 'chat' });

    return this.http
      .post<ChatResponse>(`${this.apiUrl}/generate`, {
        message,
        type: 'chat',
      })
      .pipe(
        tap((response) => console.log('Received response:', response)),
        catchError((error) => {
          console.error('Error in chat service:', error);
          throw error;
        })
      );
  }

  public analyzeCode(code: string): Observable<ChatResponse> {
    console.log('Sending code for analysis:', code);
    return this.http
      .post<ChatResponse>(`${this.apiUrl}/analyze-code`, {
        message: code,
        type: 'code-analysis',
      })
      .pipe(
        tap((response) => console.log('Received code analysis:', response)),
        catchError((error) => {
          console.error('Error in code analysis:', error);
          throw error;
        })
      );
  }

  public getRecommendations(topic: string): Observable<ChatResponse> {
    console.log('Getting recommendations for:', topic);
    return this.http
      .post<ChatResponse>(`${this.apiUrl}/recommendations`, {
        message: topic,
        type: 'analytics',
      })
      .pipe(
        tap((response) => console.log('Received recommendations:', response)),
        catchError((error) => {
          console.error('Error getting recommendations:', error);
          throw error;
        })
      );
  }

  public getProblemAnalytics(): Observable<ProblemAnalytics> {
    console.log('Getting problem analytics');
    return this.http.get<ProblemAnalytics>(`${this.apiUrl}/analytics`).pipe(
      tap((response) => console.log('Received analytics:', response)),
      catchError((error) => {
        console.error('Error getting analytics:', error);
        throw error;
      })
    );
  }
}
