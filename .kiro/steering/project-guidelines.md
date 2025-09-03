---
inclusion: always
---

# Prepio - Complete AI-Powered Coding Education Platform Guidelines

## Project Overview
PrepioAI is a comprehensive AI-powered coding education platform that combines personalized coding challenges, gamification, progress tracking, and professional interview preparation into a complete SaaS experience. The platform features dual modes: Practice Mode for skill building and Interview Prep Mode for comprehensive technical interview simulation.

## Design System
- **Theme**: Dark mode first with professional aesthetics
- **Colors**: 
  - Background: #121212 (primary), #1e1e1e (secondary)
  - Text: #FFFFFF (primary), #a1a1aa (muted)
  - Primary: #ea580c (Electric Orange)
  - Secondary: #2e2e2e, #3a3a3a
  - Accent Colors: Orange (#ea580c), Green (#22c55e), Purple (#a855f7), Orange (#f97316)
- **Typography**: 
  - Code: JetBrains Mono (preferred), Fira Code (fallback)
  - UI: Inter (preferred), Roboto (fallback)
- **Visual Effects**:
  - Glass morphism on cards and modals
  - Smooth hover animations and transitions
  - Gradient backgrounds for CTAs
  - Professional shadows and borders

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Editor**: Monaco Editor (VS Code-like experience)
- **AI**: Google Generative AI (Gemini 2.5 Flash)
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth + Google OAuth
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

## Architecture Patterns

### Component Structure
```
src/
├── app/                        # Next.js App Router
│   ├── auth/                   # Authentication pages
│   ├── practice/               # Practice Mode
│   ├── interview-prep/         # Interview Prep Mode
│   ├── mode-selection/         # Mode selection page
│   ├── profile/                # User dashboard
│   └── api/                    # Server-side API routes
├── components/
│   ├── ui/                     # Shadcn/UI components
│   ├── LandingPage.tsx         # Marketing homepage
│   ├── ChallengeInterface.tsx  # Main coding interface
│   └── [feature-components]/   # Feature-specific components
└── lib/                        # Utilities and configurations
```

### Naming Conventions
- **Components**: PascalCase (e.g., `ChallengeInterface.tsx`)
- **Pages**: lowercase with hyphens (e.g., `interview-prep/`)
- **Utilities**: camelCase (e.g., `generateChallenge`)
- **Types**: PascalCase with descriptive names (e.g., `ChallengeRequest`)

## Core Features

### 1. Dual Mode System
- **Practice Mode** (`/practice`): Quick coding challenges for skill building
- **Interview Prep Mode** (`/interview-prep`): 4-stage comprehensive interview simulation
- **Mode Selection** (`/mode-selection`): Clear user journey between modes

### 2. AI Integration
- **Challenge Generation**: Context-aware challenges based on skill level, language, and type
- **Evaluation System**: Multi-dimensional scoring (correctness, efficiency, code quality)
- **Interview Simulation**: Company-specific, role-based, experience-appropriate questions
- **Fallback System**: High-quality static challenges when AI is unavailable

### 3. Gamification System
- **8-Level Progression**: From Code Hatchling to Code Cosmos
- **Achievement Badges**: Unique emojis and colors for milestones
- **Daily Streaks**: Real-time calculation based on completion dates
- **Progress Tracking**: Visual progress bars and statistics

### 4. User Management
- **Authentication**: Google OAuth + email/password with verification
- **Profile Dashboard**: Comprehensive analytics and progress tracking
- **Protected Routes**: Smart redirects and session management
- **Progress Persistence**: All challenges and progress saved to database

## Development Guidelines

### Code Quality
- **TypeScript**: 100% type safety, no `any` types
- **Error Handling**: Comprehensive try-catch blocks with user-friendly messages
- **Loading States**: Always provide loading indicators for async operations
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### AI Integration Best Practices
- **Prompt Engineering**: Clear, specific prompts with context
- **Error Handling**: Graceful fallbacks when AI services are unavailable
- **Rate Limiting**: Respect API limits and implement proper retry logic
- **Security**: Never expose API keys, use server-side routes

### Database Patterns
- **Row Level Security**: Implement RLS for all user data
- **Real-time Updates**: Use Supabase real-time for live data
- **Efficient Queries**: Optimize database queries with proper indexing
- **Data Validation**: Server-side validation for all inputs

### UI/UX Principles
- **Accessibility**: Proper ARIA labels, keyboard navigation, color contrast
- **Performance**: Lazy loading, code splitting, optimized images
- **Feedback**: Clear success/error states, progress indicators
- **Consistency**: Reuse components, maintain design system

## Security & Compliance
- **Authentication**: Secure session management with Supabase Auth
- **Data Protection**: GDPR/CCPA compliant data handling
- **API Security**: Server-side API routes with proper validation
- **Legal Pages**: Terms of Service and Privacy Policy included

## Multi-Language Support
**Supported Languages**: JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby

**Language-Specific Features**:
- Syntax highlighting with Monaco Editor
- Language-appropriate challenge types
- Idiomatic code patterns and best practices
- Proper error handling and debugging hints

## Interview Prep Mode Specifics
- **4-Stage Process**: Coding (45min) → Technical Q&A (30min) → Behavioral (20min) → Report
- **Company Types**: FAANG, Startup, Enterprise, General Tech
- **Roles**: Frontend, Backend, Full Stack, Mobile, DevOps, Data Engineer
- **Experience Levels**: Entry (0-2 years), Mid (2-5 years), Senior (5+ years)
- **Real-time Evaluation**: Instant feedback and comprehensive scoring

## Performance Optimization
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Next.js Image component with proper sizing
- **Caching**: Appropriate cache headers and strategies
- **Bundle Size**: Monitor and optimize bundle size regularly

## Testing Strategy
- **Type Safety**: TypeScript for compile-time error catching
- **Manual Testing**: Comprehensive user flow testing
- **Error Boundaries**: React error boundaries for graceful failures
- **Monitoring**: Console logging for debugging and monitoring

This platform represents a complete educational SaaS solution that leverages AI to provide personalized learning experiences for developers at all skill levels.