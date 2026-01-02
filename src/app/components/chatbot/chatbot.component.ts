import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickQuestion {
  label: string;
  question: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('inputField') private inputField!: ElementRef;

  isOpen = false;
  isMinimized = false;
  messages: ChatMessage[] = [];
  inputMessage = '';
  isLoading = false;
  hasUnread = false;

  quickQuestions: QuickQuestion[] = [
    { label: 'Pricing', question: 'How much do storage units cost?' },
    { label: 'Sizes', question: 'What size storage unit do I need?' },
    { label: 'Climate Control', question: 'Do I need climate-controlled storage?' },
    { label: 'Security', question: 'How secure are the storage facilities?' },
    { label: '24-Hour Access', question: 'Can I access my unit anytime?' },
    { label: 'Reservations', question: 'How do I reserve a storage unit?' }
  ];

  private apiUrl = '/api/chat';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Add welcome message
    this.messages.push({
      role: 'assistant',
      content: `Hi! I'm here to help you find the perfect storage unit. Ask me about pricing, sizes, features, or anything else!`,
      timestamp: new Date()
    });
  }

  toggleChat(): void {
    if (this.isMinimized) {
      this.isMinimized = false;
    } else {
      this.isOpen = !this.isOpen;
    }
    this.hasUnread = false;

    if (this.isOpen) {
      setTimeout(() => {
        this.inputField?.nativeElement?.focus();
        this.scrollToBottom();
      }, 100);
    }
  }

  minimizeChat(): void {
    this.isMinimized = true;
  }

  closeChat(): void {
    this.isOpen = false;
    this.isMinimized = false;
  }

  askQuickQuestion(question: string): void {
    this.inputMessage = question;
    this.sendMessage();
  }

  sendMessage(): void {
    const message = this.inputMessage.trim();
    if (!message || this.isLoading) return;

    // Add user message
    this.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    this.inputMessage = '';
    this.isLoading = true;
    this.scrollToBottom();

    // Build history for context (last 6 messages)
    const history = this.messages.slice(-7, -1).map(m => ({
      role: m.role,
      content: m.content
    }));

    this.http.post<{ response: string; source: string }>(this.apiUrl, {
      message,
      history
    }).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'assistant',
          content: response.response,
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();

        if (this.isMinimized) {
          this.hasUnread = true;
        }
      },
      error: (error) => {
        console.error('Chat error:', error);
        this.messages.push({
          role: 'assistant',
          content: `I'm having trouble connecting. Try asking about storage sizes, pricing, or security features!`,
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  }
}
