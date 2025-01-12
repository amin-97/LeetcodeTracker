// src/app/components/leetcode-calendar/interfaces/chat-message.interface.ts
export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface LeetCodeHint {
  type: 'pattern' | 'complexity' | 'strategy';
  content: string;
}
