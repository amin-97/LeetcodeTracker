import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AddProblemDialogComponent } from './add-problem-dialog/add-problem-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {
  LeetcodeProblem,
  AddProblemDialogResult,
} from './interfaces/leetcode-problem.interface';
import { ChatMessage } from './interfaces/chat-message.interface';
import { from } from 'rxjs';
import {
  LeetCodeChatService,
  ChatResponse,
  ProblemAnalytics,
} from './services/leetcode-chat.service';
import { ProblemService } from './services/problem.service';

@Component({
  selector: 'app-leetcode-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    FormsModule,
  ],
  templateUrl: './leetcode-calendar.component.html',
  styleUrls: ['./leetcode-calendar.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(10px)' })
        ),
      ]),
    ]),
    trigger('typingIndicator', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class LeetCodeCalendarComponent implements OnInit {
  currentDate = new Date();
  currentView = 'month';
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  calendarDays: Array<{ date: Date; isCurrentMonth: boolean }> = [];
  problems: LeetcodeProblem[] = [];
  todayProblems: LeetcodeProblem[] = [];
  upcomingProblems: LeetcodeProblem[] = [];
  chatMessages: ChatMessage[] = [];
  chatMessage = '';
  isTyping = false;
  selectedMessage: ChatMessage | null = null;
  selectedDate: Date | null = null;
  selectedProblem: LeetcodeProblem | null = null;
  isLoading = false;
  errorMessage = '';
  hoverProblem: LeetcodeProblem | null = null;
  problemAnalytics: ProblemAnalytics | null = null;

  @ViewChild('contextMenu') contextMenu!: MatMenuTrigger;
  menuTopLeftPosition = { x: '0', y: '0' };

  constructor(
    private dialog: MatDialog,
    private chatService: LeetCodeChatService,
    private problemService: ProblemService
  ) {}

  ngOnInit(): void {
    this.generateCalendarDays();
    this.loadProblems();
    this.loadProblemAnalytics();
  }

  loadProblems(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.problemService.getAllProblems().subscribe({
      next: (problems: LeetcodeProblem[]) => {
        console.log('Loaded problems:', problems);
        this.problems = problems;
        this.updateProblemLists();
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error loading problems:', error);
        this.errorMessage = 'Failed to load problems. Please try again.';
        this.isLoading = false;
      },
    });
  }

  loadProblemAnalytics(): void {
    this.chatService.getProblemAnalytics().subscribe({
      next: (analytics: ProblemAnalytics) => {
        this.problemAnalytics = analytics;
      },
      error: (error: Error) => {
        console.error('Error loading analytics:', error);
      },
    });
  }

  generateCalendarDays(): void {
    this.calendarDays = [];
    const firstDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );

    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek; i > 0; i--) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i);
      this.calendarDays.push({ date, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        i
      );
      this.calendarDays.push({ date, isCurrentMonth: true });
    }

    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(lastDay);
      date.setDate(date.getDate() + i);
      this.calendarDays.push({ date, isCurrentMonth: false });
    }
  }

  getMinicalendarDays(): Array<{ date: Date; isCurrentMonth: boolean }> {
    return this.calendarDays;
  }

  getProblemsForDate(date: Date): LeetcodeProblem[] {
    const dateString = this.formatDate(date);
    console.log('Getting problems for date:', dateString);
    const problems = this.problems.filter(
      (problem) => this.formatDate(new Date(problem.date)) === dateString
    );
    console.log('Found problems:', problems);
    return problems;
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1
    );
    this.generateCalendarDays();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1
    );
    this.generateCalendarDays();
  }

  previousMonthMini(): void {
    this.previousMonth();
  }

  nextMonthMini(): void {
    this.nextMonth();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  hasSubmission(date: Date): boolean {
    const dateString = this.formatDate(date);
    return this.problems.some(
      (problem) => this.formatDate(new Date(problem.date)) === dateString
    );
  }

  getSubmissionClass(date: Date): string {
    const problem = this.problems.find(
      (p) => this.formatDate(new Date(p.date)) === this.formatDate(date)
    );
    return problem ? `submission-${problem.difficulty.toLowerCase()}` : '';
  }

  isProblemSolved(date: Date): boolean {
    const problem = this.problems.find(
      (p) => this.formatDate(new Date(p.date)) === this.formatDate(date)
    );
    return problem ? problem.solved : false;
  }

  selectDate(date: Date, event?: MouseEvent): void {
    this.currentDate = date;
    this.updateProblemLists();

    if (event) {
      event.preventDefault();
      this.selectedDate = date;
      this.selectedMessage = null;
      this.selectedProblem = null;
      this.menuTopLeftPosition.x = event.clientX + 'px';
      this.menuTopLeftPosition.y = event.clientY + 'px';
      this.contextMenu.openMenu();
    }
  }

  onViewChange(event: { value: string }): void {
    this.currentView = event.value;
  }

  updateProblemLists(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.todayProblems = this.problems.filter((problem) => {
      const problemDate = new Date(problem.date);
      return this.formatDate(problemDate) === this.formatDate(today);
    });

    this.upcomingProblems = this.problems
      .filter((problem) => {
        const problemDate = new Date(problem.date);
        return problemDate > today;
      })
      .slice(0, 5);
  }

  openAddDialog(initialTitle: string = '', date: Date | null = null): void {
    const dialogRef = this.dialog.open(AddProblemDialogComponent, {
      width: '500px',
      data: {
        title: initialTitle,
        date: date
          ? date.toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        difficulty: 'Easy',
        topic: '',
        solved: false,
        notes: '',
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: AddProblemDialogResult | undefined) => {
        if (result) {
          console.log('Dialog result:', result);
          const problemData = {
            title: result.title,
            difficulty: result.difficulty,
            date: result.date,
            topic: result.topic,
            solved: result.solved,
            notes: result.notes,
          };

          this.problemService.addProblem(problemData).subscribe({
            next: (newProblem: LeetcodeProblem) => {
              console.log('New problem added:', newProblem);
              this.problems.push(newProblem);
              console.log('Updated problems array:', this.problems);
              this.updateProblemLists();
              this.generateCalendarDays();
              this.loadProblemAnalytics();
            },
            error: (error: Error) => {
              console.error('Error adding problem:', error);
              this.errorMessage = 'Failed to add problem. Please try again.';
            },
          });
        }
      });
  }

  onMessageRightClick(event: MouseEvent, message: ChatMessage): void {
    event.preventDefault();
    this.selectedMessage = message;
    this.selectedProblem =
      this.problems.find(
        (p) => p.title.toLowerCase() === message.text.toLowerCase()
      ) || null;
    this.selectedDate = null;
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

  addProblem(message: ChatMessage): void {
    this.openAddDialog(message.text);
  }

  openEditProblem(event: MouseEvent, problem: LeetcodeProblem): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddProblemDialogComponent, {
      width: '500px',
      data: {
        title: problem.title,
        difficulty: problem.difficulty,
        date: new Date(problem.date).toISOString().slice(0, 16),
        topic: problem.topic,
        solved: problem.solved,
        notes: problem.notes,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: AddProblemDialogResult | undefined) => {
        if (result) {
          const updatedProblem = {
            ...problem,
            ...result,
          };

          this.problemService
            .updateProblem(problem.id, updatedProblem)
            .subscribe({
              next: (updated: LeetcodeProblem) => {
                const index = this.problems.findIndex(
                  (p) => p.id === problem.id
                );
                if (index !== -1) {
                  this.problems[index] = updated;
                  this.updateProblemLists();
                  this.generateCalendarDays();
                  this.loadProblemAnalytics();
                }
              },
              error: (error: Error) => {
                console.error('Error updating problem:', error);
                this.errorMessage =
                  'Failed to update problem. Please try again.';
              },
            });
        }
      });
  }

  setHoverProblem(problem: LeetcodeProblem | null): void {
    this.hoverProblem = problem;
  }

  sendMessage(): void {
    if (this.chatMessage.trim()) {
      console.log('Sending message:', this.chatMessage); // Add this

      // Add user message to chat
      this.chatMessages.push({
        id: Date.now(),
        text: this.chatMessage,
        isUser: true,
        timestamp: new Date(),
      });

      const userMessage = this.chatMessage;
      this.chatMessage = '';
      this.isTyping = true;

      // Regular chat message
      this.chatService.generateResponse(userMessage).subscribe({
        next: (response: ChatResponse) => {
          console.log('Received response:', response); // Add this
          this.handleChatResponse(response);
        },
        error: (error) => {
          console.error('Error in chat:', error); // Add this
          this.handleError(error);
        },
      });
    }
  }
  private handleChatResponse(response: ChatResponse): void {
    this.isTyping = false;
    this.chatMessages.push({
      id: Date.now(),
      text: response.content,
      isUser: false,
      timestamp: new Date(),
    });

    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  }

  private handleError(error: any): void {
    this.isTyping = false;
    this.errorMessage = 'Failed to get response. Please try again.';
    console.error('Chat error:', error);
  }

  private formatDate(date: Date): string {
    console.log('Formatting date:', date);
    const formatted = date.toISOString().split('T')[0];
    console.log('Formatted date:', formatted);
    return formatted;
  }

  openDeleteConfirmation(problem: LeetcodeProblem): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Problem',
        message: `Are you sure you want to delete "${problem.title}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteProblem(problem.id);
      }
    });
  }

  deleteProblem(id: number): void {
    this.problemService.deleteProblem(id).subscribe({
      next: () => {
        this.problems = this.problems.filter((p) => p.id !== id);
        this.updateProblemLists();
        this.generateCalendarDays();
        this.loadProblemAnalytics();
      },
      error: (error: Error) => {
        console.error('Error deleting problem:', error);
        this.errorMessage = 'Failed to delete problem. Please try again.';
      },
    });
  }

  onProblemRightClick(event: MouseEvent, problem: LeetcodeProblem): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProblem = problem;
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

  getWeeklyProgress(): void {
    this.isTyping = true;
    this.chatService.getProblemAnalytics().subscribe({
      next: (analytics: ProblemAnalytics) => {
        this.isTyping = false;
        this.problemAnalytics = analytics;

        const progressMessage = `
          Weekly Progress Summary:\n
          Topics covered: ${Object.keys(analytics.topicCounts).join(', ')}\n
          Most practiced: ${this.getMostPracticedTopic(analytics.topicCounts)}\n
          Areas to focus on: ${analytics.weakTopics.join(', ')}\n
          Recommended topics: ${analytics.recommendedTopics.join(', ')}
        `;

        this.chatMessages.push({
          id: Date.now(),
          text: progressMessage,
          isUser: false,
          timestamp: new Date(),
        });
      },
      error: () => {
        this.isTyping = false;
        this.errorMessage =
          'Failed to get progress analytics. Please try again.';
      },
    });
  }

  private getMostPracticedTopic(topicCounts: {
    [key: string]: number;
  }): string {
    return Object.entries(topicCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];
  }
}
