import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { inject } from '@vercel/analytics';
import { SearchFiltersComponent } from './components/search-filters/search-filters.component';
import { UnitListComponent } from './components/unit-list/unit-list.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SearchFiltersComponent, UnitListComponent, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Storage Finder';

  ngOnInit() {
    // Initialize Vercel Web Analytics
    inject();
  }
}
