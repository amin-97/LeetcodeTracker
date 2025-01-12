// src/app/components/leetcode-calendar/add-problem-dialog/add-problem-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddProblemDialogResult } from '../interfaces/leetcode-problem.interface';

@Component({
  selector: 'app-add-problem-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.title ? 'Edit Problem' : 'Add New Problem' }}
    </h2>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Problem Title</mat-label>
        <input matInput [(ngModel)]="data.title" required />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Difficulty</mat-label>
        <mat-select [(ngModel)]="data.difficulty" required>
          <mat-option value="Easy">Easy</mat-option>
          <mat-option value="Medium">Medium</mat-option>
          <mat-option value="Hard">Hard</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Topic</mat-label>
        <mat-select [(ngModel)]="data.topic" required>
          <mat-option value="Arrays">Arrays</mat-option>
          <mat-option value="Strings">Strings</mat-option>
          <mat-option value="LinkedList">Linked List</mat-option>
          <mat-option value="Trees">Trees</mat-option>
          <mat-option value="Graphs">Graphs</mat-option>
          <mat-option value="DynamicProgramming"
            >Dynamic Programming</mat-option
          >
          <mat-option value="Backtracking">Backtracking</mat-option>
          <mat-option value="HashTable">Hash Table</mat-option>
          <mat-option value="TwoPointers">Two Pointers</mat-option>
          <mat-option value="Other">Other</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Date</mat-label>
        <input
          matInput
          type="datetime-local"
          [(ngModel)]="data.date"
          required
        />
      </mat-form-field>

      <div class="checkbox-field">
        <mat-checkbox [(ngModel)]="data.solved">Problem Solved</mat-checkbox>
      </div>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Notes</mat-label>
        <textarea matInput [(ngModel)]="data.notes" rows="4"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-button
        color="primary"
        (click)="onSave()"
        [disabled]="!isValid()"
      >
        Save
      </button>
    </div>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 15px;
      }
      .checkbox-field {
        margin: 15px 0;
      }
      mat-dialog-actions {
        justify-content: flex-end;
        gap: 8px;
      }
    `,
  ],
})
export class AddProblemDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddProblemDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      date: string;
      topic: string;
      solved: boolean;
      notes?: string;
    }
  ) {
    this.data = {
      ...{
        title: '',
        difficulty: 'Easy',
        date: new Date().toISOString().slice(0, 16),
        topic: '',
        solved: false,
        notes: '',
      },
      ...data,
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.isValid()) {
      this.dialogRef.close(this.data);
    }
  }

  isValid(): boolean {
    return !!(
      this.data.title &&
      this.data.difficulty &&
      this.data.date &&
      this.data.topic
    );
  }
}
