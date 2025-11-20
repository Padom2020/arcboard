# Design Document - ARC Blockchain Onboarding Platform

## Overview

The ARC Blockchain Onboarding Platform is a Next.js 14+ application using the App Router architecture, React Server Components, and TypeScript. The platform integrates multiple services including an AI agent (via OpenAI or similar LLM API), OpenZeppelin API for smart contract generation, and a database for storing DApp directory entries and user progress.

The architecture follows a modular, feature-based structure with clear separation between client and server components, API routes for backend logic, and external service integrations.

## Architecture

### Technology Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18+ with Server Components
- TypeScript
- Tailwind CSS for styling
- Shadcn/ui for component library
- React Query (TanStack Query) for data fetching and caching

**Backend:**
- Next.js API Routes (Route Handlers)
- Prisma ORM for database operations
- PostgreSQL database (or SQLite for development)

**External Services:**
- OpenAI API (or alternative LLM) for AI Agent
- OpenZeppelin API for smart contract generation
- Vercel (recommended deployment platform)

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  DApp    │  │    AI    │  │ Contract │  │Onboarding│   │
│  │Directory │  │ Assistant│  │Generator │  │  Guide   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  /api/   │  │  /api/   │  │  /api/   │  │  /api/   │   │
│  │  dapps   │  │   chat   │  │contracts │  │ progress │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Database   │  │  OpenAI API  │  │ OpenZeppelin │
│  (Prisma)    │  │              │  │     API      │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Components and Interfaces

### 1. DApp Directory Module

**Components:**
- `DAppGrid` (Server Component): Displays paginated grid of DApps
- `DAppCard` (Client Component): Individual DApp card with image, title, description
- `DAppSearch` (Client Component): Search and filter interface
- `DAppDetail` (Server Component): Detailed view of a single DApp
- `DAppSubmissionForm` (Client Component): Form for submitting new DApps

**API Routes:**
- `GET /api/dapps` - Fetch all DApps with optional filters (category, search query)
- `GET /api/dapps/[id]` - Fetch single DApp details
- `POST /api/dapps` - Submit new DApp (with validation)
- `GET /api/dapps/categories` - Fetch available categories

**Data Flow:**
1. Server Component fetches initial DApps data
2. Client components handle search/filter interactions
3. API routes query database via Prisma
4. Results cached with React Query for client-side navigation

### 2. AI Assistant Module

**Components:**
- `ChatInterface` (Client Component): Main chat UI with message list and input
- `MessageBubble` (Client Component): Individual message display
- `ChatInput` (Client Component): Text input with submit button
- `CodeBlock` (Client Component): Syntax-highlighted code display

**API Routes:**
- `POST /api/chat` - Send message to AI agent and stream response
- `POST /api/chat/new` - Start new chat session
- `GET /api/chat/history` - Retrieve chat history (optional for logged-in users)

**Data Flow:**
1. User submits message via ChatInput
2. POST to /api/chat with message and conversation context
3. API route calls OpenAI API with ARC blockchain system prompt
4. Stream response back to client using Server-Sent Events or streaming response
5. Update UI with AI response

**AI Agent Configuration:**
- System prompt includes ARC blockchain documentation and context
- Temperature: 0.7 for balanced creativity and accuracy
- Max tokens: 1000 per response
- Model: GPT-4 or GPT-3.5-turbo depending on budget

### 3. Smart Contract Generator Module

**Components:**
- `ContractTemplateSelector` (Client Component): Grid of OpenZeppelin templates
- `ContractConfigForm` (Client Component): Form for contract parameters
- `ContractPreview` (Client Component): Code preview with syntax highlighting
- `ContractDownload` (Client Component): Download button for generated code

**API Routes:**
- `GET /api/contracts/templates` - Fetch available OpenZeppelin templates
- `POST /api/contracts/generate` - Generate contract code from template and parameters

**Data Flow:**
1. User selects template from ContractTemplateSelector
2. User fills in parameters in ContractConfigForm
3. POST to /api/contracts/generate with template ID and parameters
4. API route calls OpenZeppelin API
5. Return generated Solidity code
6. Display in ContractPreview with download option

**OpenZeppelin Integration:**
- Use OpenZeppelin Contracts Wizard API or construct contracts programmatically
- Support common templates: ERC20, ERC721, ERC1155, Governor, AccessControl
- Validate parameters before API call

### 4. Debugging Assistant Module

**Components:**
- `DebugForm` (Client Component): Form for submitting error messages and code
- `DebugSuggestions` (Client Component): Display AI-generated solutions
- `DebugHistory` (Client Component): List of previous debugging sessions

**API Routes:**
- `POST /api/debug` - Submit debugging request to AI agent
- `GET /api/debug/history` - Fetch previous debugging sessions

**Data Flow:**
1. Developer submits error message and code snippet via DebugForm
2. POST to /api/debug with error details
3. API route calls OpenAI API with specialized debugging prompt
4. Return structured suggestions with code examples
5. Display in DebugSuggestions component

**AI Debugging Configuration:**
- Specialized system prompt for ARC blockchain debugging
- Include common error patterns and solutions in context
- Format responses as structured JSON with solution steps

### 5. Onboarding Guide Module

**Components:**
- `OnboardingProgress` (Client Component): Progress tracker showing completion
- `TutorialStep` (Client Component): Individual tutorial step with content
- `TutorialNavigation` (Client Component): Next/Previous navigation
- `OnboardingChecklist` (Client Component): Overview of all steps

**API Routes:**
- `GET /api/progress` - Fetch user's onboarding progress
- `POST /api/progress` - Update progress when step completed
- `GET /api/tutorials` - Fetch tutorial content

**Data Flow:**
1. Fetch user progress from API or localStorage
2. Display current tutorial step
3. User completes step and clicks "Mark Complete"
4. Update progress via API
5. Unlock next step and update UI

**Tutorial Structure:**
```typescript
interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  category: 'beginner' | 'intermediate' | 'advanced';
}

interface TutorialStep {
  id: string;
  title: string;
  content: string; // Markdown content
  estimatedTime: number; // minutes
  prerequisites: string[]; // step IDs
}
```

### 6. Navigation and Layout

**Components:**
- `Header` (Server Component): Top navigation with logo and main links
- `Sidebar` (Client Component): Collapsible sidebar for mobile
- `Footer` (Server Component): Footer with links and information
- `SearchBar` (Client Component): Global search interface

**Layout Structure:**
```
app/
├── layout.tsx (Root layout with Header/Footer)
├── page.tsx (Homepage)
├── dapps/
│   ├── page.tsx (DApp directory)
│   └── [id]/page.tsx (DApp detail)
├── assistant/
│   └── page.tsx (AI chat interface)
├── contracts/
│   └── page.tsx (Contract generator)
├── debug/
│   └── page.tsx (Debugging assistant)
└── onboarding/
    └── page.tsx (Onboarding guide)
```

## Data Models

### Database Schema (Prisma)

```prisma
model DApp {
  id          String   @id @default(cuid())
  name        String
  description String
  category    String
  websiteUrl  String
  logoUrl     String?
  status      String   @default("pending") // pending, approved, rejected
  contactEmail String
  features    String[] // Array of feature descriptions
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model UserProgress {
  id            String   @id @default(cuid())
  userId        String   @unique // Can be session ID for anonymous users
  completedSteps String[] // Array of completed tutorial step IDs
  currentStep   String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ChatSession {
  id        String   @id @default(cuid())
  userId    String?  // Optional for logged-in users
  messages  Json[]   // Array of message objects
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model DebugSession {
  id          String   @id @default(cuid())
  userId      String?
  errorMessage String
  codeSnippet String?
  suggestions Json     // AI-generated suggestions
  createdAt   DateTime @default(now())
}
```

### TypeScript Interfaces

```typescript
// DApp Types
interface DApp {
  id: string;
  name: string;
  description: string;
  category: DAppCategory;
  websiteUrl: string;
  logoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  contactEmail: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

type DAppCategory = 'DeFi' | 'NFT' | 'Gaming' | 'Infrastructure' | 'Social' | 'Other';

// Chat Types
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
}

// Contract Types
interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: ContractParameter[];
}

interface ContractParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'address';
  required: boolean;
  description: string;
  defaultValue?: any;
}

interface GeneratedContract {
  code: string;
  language: 'solidity';
  template: string;
  parameters: Record<string, any>;
}

// Debug Types
interface DebugRequest {
  errorMessage: string;
  codeSnippet?: string;
  context?: string;
}

interface DebugSuggestion {
  title: string;
  description: string;
  codeExample?: string;
  references?: string[];
}
```

## Error Handling

### Client-Side Error Handling

1. **Network Errors**: Display user-friendly error messages with retry options
2. **Validation Errors**: Show inline validation messages on forms
3. **API Errors**: Parse error responses and display specific error messages
4. **Loading States**: Show skeleton loaders during data fetching

**Error Boundary Component:**
```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Server-Side Error Handling

1. **API Route Errors**: Return structured error responses with appropriate HTTP status codes
2. **Database Errors**: Log errors and return generic messages to clients
3. **External API Errors**: Implement retry logic and fallback responses
4. **Validation Errors**: Return detailed validation error messages

**Standard Error Response Format:**
```typescript
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: any;
  };
}
```

### External Service Error Handling

1. **OpenAI API**: Implement exponential backoff retry, handle rate limits, provide fallback responses
2. **OpenZeppelin API**: Validate requests before calling, handle timeout errors, cache successful responses
3. **Database**: Implement connection pooling, handle transaction failures, log all errors

## Testing Strategy

### Unit Testing
- Test utility functions and helpers
- Test data transformation logic
- Test validation functions
- Framework: Jest + React Testing Library

### Integration Testing
- Test API routes with mock database
- Test component interactions
- Test form submissions and validations
- Framework: Jest + MSW (Mock Service Worker)

### End-to-End Testing
- Test critical user flows (DApp search, AI chat, contract generation)
- Test navigation between pages
- Test form submissions
- Framework: Playwright or Cypress

### Testing Priorities for MVP
1. API route functionality (all endpoints)
2. Form validation (DApp submission, contract generation)
3. AI chat message flow
4. DApp search and filtering
5. Onboarding progress tracking

### Test Coverage Goals
- Aim for 70%+ coverage on utility functions
- 100% coverage on API routes
- Critical path E2E tests for main features

## Performance Considerations

1. **Server Components**: Use React Server Components for static content to reduce client bundle size
2. **Image Optimization**: Use Next.js Image component for DApp logos
3. **Code Splitting**: Lazy load heavy components (code editor, syntax highlighter)
4. **Caching**: Implement React Query caching for API responses
5. **Database Indexing**: Add indexes on frequently queried fields (DApp category, name)
6. **API Rate Limiting**: Implement rate limiting on AI endpoints to prevent abuse

## Security Considerations

1. **Input Validation**: Validate all user inputs on both client and server
2. **API Key Protection**: Store API keys in environment variables, never expose to client
3. **CORS Configuration**: Configure appropriate CORS headers for API routes
4. **Rate Limiting**: Implement rate limiting on expensive operations (AI calls, contract generation)
5. **Content Security Policy**: Configure CSP headers to prevent XSS attacks
6. **SQL Injection Prevention**: Use Prisma parameterized queries
7. **DApp Submission Moderation**: Implement approval workflow to prevent spam

## Deployment Architecture

**Recommended Platform**: Vercel

**Environment Variables:**
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
OPENZEPPELIN_API_KEY=...
NEXT_PUBLIC_APP_URL=https://...
```

**Database Hosting**: 
- Production: Vercel Postgres or Supabase
- Development: Local PostgreSQL or SQLite

**CI/CD Pipeline:**
1. Push to main branch triggers deployment
2. Run tests before deployment
3. Run database migrations
4. Deploy to Vercel
5. Run smoke tests on production

## MVP Scope

For the initial MVP, focus on these core features:

**Phase 1 (MVP):**
1. DApp directory with search and filtering
2. Basic AI assistant for ARC blockchain questions
3. Simple smart contract generator (3-5 templates)
4. Static onboarding guide (no progress tracking)
5. Basic responsive UI

**Phase 2 (Post-MVP):**
1. User authentication and profiles
2. DApp submission with admin approval workflow
3. Debugging assistant with code analysis
4. Advanced onboarding with progress tracking
5. Community features (comments, ratings)

**Phase 3 (Future):**
1. Developer dashboard with analytics
2. Integration with ARC blockchain testnet
3. Smart contract deployment from platform
4. Advanced AI features (code generation, auditing)
5. Mobile app
