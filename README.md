# Storage Finder

A self-storage marketplace demo built with Angular 17. This is a **portfolio project** demonstrating modern Angular development practices—not a production application.

**[Live Demo](https://storage-finder-eight.vercel.app)** | **[Portfolio](https://hereshecodes.com)**

## About This Project

Built to demonstrate Angular skills for a role at [Storable](https://www.storable.com/), a leader in self-storage software. The app showcases a marketplace-style interface for finding and comparing storage units.

**This is a demo with simulated data.** No real storage facilities or bookings.

## Tech Stack

- **Angular 17** - Standalone components, new control flow syntax (`@if`, `@for`)
- **TypeScript** - Strict typing throughout
- **RxJS** - Reactive state management with BehaviorSubjects
- **SCSS** - Component-scoped styling
- **Claude AI** - Chatbot powered by Anthropic's Claude API

## Features

- **Search & Filter** - Location search, size/price filters, feature toggles
- **AI Chatbot** - Claude-powered assistant with FAQ knowledge base
- **Responsive Design** - Mobile-first with collapsible filters
- **WCAG 2.0 Accessible** - Skip links, ARIA labels, keyboard navigation, screen reader support
- **Demo Mode** - Clear indicators that this is a portfolio project

## Accessibility

Built with accessibility in mind:
- Skip to main content link
- Proper heading hierarchy
- Form labels and fieldsets
- ARIA live regions for dynamic content
- Focus-visible styles
- Reduced motion support

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
ng serve

# Build for production
npm run build
```

## Project Structure

```
src/app/
├── components/
│   ├── chatbot/          # Claude-powered chat assistant
│   ├── search-filters/   # Search bar and filter controls
│   ├── unit-card/        # Individual storage unit display
│   └── unit-list/        # Grid of unit cards with states
├── models/               # TypeScript interfaces
├── services/             # Storage service with mock data
└── app.component.*       # Root component with layout

api/
└── chat.js               # Vercel serverless function for chatbot
```

## Chatbot

The integrated chatbot can answer common questions about:
- **Pricing** - Unit costs and what affects pricing
- **Sizes** - Which size is right for different needs
- **Climate Control** - When and why you need it
- **Security** - How facilities keep items safe
- **Access Hours** - When you can visit your unit
- **Reservations** - How to book a unit

FAQ questions are answered instantly without API calls. More complex questions use Claude for intelligent responses.

## Why I Built This

I'm applying for a position at Storable and wanted to demonstrate:
1. Proficiency with their Angular/TypeScript stack
2. Understanding of their self-storage domain
3. Commitment to accessible, maintainable code

---

Built by [hereshecodes](https://hereshecodes.com)
