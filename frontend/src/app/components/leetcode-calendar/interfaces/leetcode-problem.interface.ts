// src/app/components/leetcode-calendar/interfaces/leetcode-problem.interface.ts
export interface LeetcodeProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  date: string;
  topic: string;
  solved: boolean;
  notes?: string;
}

export interface AddProblemDialogResult {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  date: string;
  topic: string;
  solved: boolean;
  notes?: string;
}
