// src/app/app.component.ts
import { Component } from '@angular/core';
import { LeetCodeCalendarComponent } from './components/leetcode-calendar/leetcode-calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LeetCodeCalendarComponent],
  template: ` <app-leetcode-calendar></app-leetcode-calendar> `,
})
export class AppComponent {
  title = 'LeetCode Tracker';
}
