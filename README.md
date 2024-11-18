# Task Management Application

A Next.js-based task management application built with modern React practices and TypeScript.

## Technical Stack

- **Framework**: React v19
- **Meta Framework**: Next.js v15 (App Router)
- **Language**: TypeScript
- **State Management**: 
  - Zustand (used as a local database for this test/exam purpose)
  - React Query (data fetching/caching)
  - URL State (for filters)
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI + shadcn/ui

## Key Features

- Task CRUD operations
- Task filtering and search
- Task status management
- Due date tracking
- Responsive design
- URL-persisted filters

## Getting Started

1. **Install Dependencies**
```bash
pnpm install
```

2. **Run Development Server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture Decisions

### 1. State Management
- **Zustand**: Used as a local database for this test/exam purpose instead of a real backend
  - Provides simple and efficient state management
  - Easy to replace with real API calls later
- **React Query**: Handles data fetching and caching
- **URL State**: Maintains filter state in URL for shareable links

### 2. Project Structure
```
src/
├── features/          # Feature modules
│   └── task/         # Task management feature
│       ├── components/  # Task-specific components
│       ├── hooks.ts    # Custom hooks
│       ├── schemas.ts  # Type definitions
│       └── stores.ts   # State management
├── lib/              # Core utilities
│   ├── schemas/      # Shared schemas
│   └── services/     # Business logic
└── components/       # Shared components
    └── ui/           # UI component library
```

### 3. Type Safety
- Zod for runtime validation
- TypeScript for static typing
- Strict type checking enabled

### 4. Performance Optimizations
- Component memoization
- React Query caching
- Virtualized lists for large datasets

## Testing

Run the test suite:

```bash
pnpm test
```

Tests cover:
- Business logic
- Component rendering
- User interactions
- Edge cases

## Development Notes

- Uses feature-based architecture for scalability
- Implements strict TypeScript for type safety
- Follows React best practices and hooks patterns
- Uses Zustand as a mock database (can be replaced with real API)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

The application can be deployed on Vercel or any other Next.js-compatible hosting platform.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
