// src/app/services/problem.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeetcodeProblem } from '../interfaces/leetcode-problem.interface';

@Injectable({
  providedIn: 'root',
})
export class ProblemService {
  private apiUrl = 'http://localhost:8080/api/problems';

  constructor(private http: HttpClient) {}

  getAllProblems(): Observable<LeetcodeProblem[]> {
    return this.http.get<LeetcodeProblem[]>(this.apiUrl);
  }

  getProblem(id: number): Observable<LeetcodeProblem> {
    return this.http.get<LeetcodeProblem>(`${this.apiUrl}/${id}`);
  }

  addProblem(
    problem: Omit<LeetcodeProblem, 'id'>
  ): Observable<LeetcodeProblem> {
    return this.http.post<LeetcodeProblem>(this.apiUrl, problem);
  }

  updateProblem(
    id: number,
    problem: LeetcodeProblem
  ): Observable<LeetcodeProblem> {
    return this.http.put<LeetcodeProblem>(`${this.apiUrl}/${id}`, problem);
  }

  deleteProblem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
