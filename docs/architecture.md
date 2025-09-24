# Architecture Documentation

## Project Overview

**ricardoalmeida-dubai** is a modern full-stack application built with the Better-T-Stack framework, featuring a monorepo structure with TypeScript, Next.js, and AI capabilities. The project implements a note-taking AI system with authentication, real-time communication, and a robust backend architecture.

## Technology Stack

### Core Technologies
- **Runtime**: Bun (1.2.15)
- **Package Manager**: Bun workspaces
- **Monorepo Management**: Turborepo (2.5.4)
- **Language**: TypeScript 5.x
- **Framework**: Next.js 15.5.0

### Backend Stack
- **Framework**: Next.js API Routes
- **API Layer**: oRPC (1.8.6) - Type-safe RPC framework
- **Database**: SQLite with LibSQL client
- **ORM**: Drizzle ORM (0.44.2)
- **Authentication**: Better Auth (1.3.13)
- **AI Integration**: Vercel AI SDK (5.0.39) with Google AI SDK

### Frontend Stack
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS (4.1.10)
- **UI Components**: Shadcn-ui components built on Radix UI primitives
- **State Management**: TanStack Query (5.85.5) with oRPC integration
- **Forms**: TanStack React Form (1.12.3)
- **Theming**: next-themes with dark/light mode
- **Icons**: Lucide React
- **Notifications**: Sonner

### Development & Quality Tools
- **Linting & Formatting**: Biome (2.2.4)
- **Code Quality**: Ultracite (5.4.4)
- **Build System**: Turborepo with caching
- **Development**: Next.js Turbopack
- **E2E Testing**: Playwright for browser automation and testing

## Project Structure

```
ricardoalmeida-dubai/
├── apps/
│   ├── server/          # Backend Next.js application
│   │   ├── src/
│   │   │   ├── app/     # Next.js App Router
│   │   │   │   ├── api/ # Authentication endpoints
│   │   │   │   ├── rpc/ # oRPC endpoint handlers
│   │   │   │   └── ai/  # AI-related routes
│   │   │   ├── db/      # Database configuration
│   │   │   │   └── schema/ # Drizzle schema definitions
│   │   │   ├── lib/     # Server utilities
│   │   │   └── routers/ # API route definitions
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   └── web/             # Frontend Next.js application
│       ├── src/
│       │   ├── app/     # Next.js App Router pages
│       │   │   ├── dashboard/ # Dashboard interface
│       │   │   ├── login/     # Authentication UI
│       │   │   └── ai/        # AI chat interface
│       │   ├── components/    # React components
│       │   │   └── ui/        # Shadcn-ui components
│       │   ├── lib/     # Client utilities
│       │   └── utils/   # Helper functions
│       └── package.json
├── tests/               # End-to-end tests
│   └── e2e/            # Playwright test suites
├── docs/                # Documentation
├── .github/             # GitHub workflows
├── .ruler/              # Ruler configuration
├── .vscode/             # VS Code settings
├── biome.json           # Biome configuration
├── turbo.json           # Turborepo configuration
├── bts.jsonc            # Better-T-Stack configuration
└── package.json         # Root workspace configuration
```

## Architecture Components

### 1. Monorepo Architecture
The project uses a monorepo structure managed by Turborepo with Bun workspaces:

- **Root workspace**: Manages shared dependencies and scripts
- **apps/server**: Backend application (Next.js API)
- **apps/web**: Frontend application (Next.js)
- **Shared configuration**: Biome, TypeScript, Turborepo configs

### 2. API Architecture (oRPC)
The application uses oRPC for type-safe client-server communication:

**Server Side (`apps/server/src/lib/orpc.ts`)**:
- Context-aware procedures with authentication middleware
- Public and protected procedure definitions
- Type-safe error handling with ORPCError

**Client Side (`apps/web/src/utils/orpc.ts`)**:
- TanStack Query integration for data fetching
- Automatic error handling with toast notifications
- Credential-based authentication
- Server-side rendering support

### 3. Database Architecture
**Schema Design (`apps/server/src/db/schema/auth.ts`)**:
- **User table**: Core user information with email verification
- **Session table**: Session management with IP and user agent tracking
- **Account table**: OAuth and credential provider management
- **Verification table**: Email verification and password reset tokens

**ORM Integration**:
- Drizzle ORM with SQLite backend
- Type-safe database queries
- Migration management with drizzle-kit

### 4. Authentication System
**Better Auth Integration**:
- Server-side auth configuration (`apps/server/src/lib/auth.ts`)
- Client-side auth client (`apps/web/src/lib/auth-client.ts`)
- Email/password authentication enabled
- Cross-origin support with secure cookie handling
- Database adapter integration with Drizzle

### 5. Frontend Architecture
**Component Structure**:
- **UI Components**: Shadcn-ui components in `components/ui/` built on Radix UI primitives
- **Feature Components**: Domain-specific components (forms, menus, etc.)
- **Layout Components**: Theme providers, headers, navigation

**Styling System**:
- Tailwind CSS for utility-first styling
- Shadcn-ui design system with consistent component patterns
- Class Variance Authority for component variants
- Custom CSS animations with tw-animate-css
- Dark/light theme support

**State Management**:
- TanStack Query for server state
- React hooks for local state
- Form state with TanStack React Form

### 6. AI Integration
The project includes AI capabilities through:
- Vercel AI SDK integration
- Google AI SDK for LLM interactions
- Streamdown for markdown processing
- Shiki for syntax highlighting
- AI-specific routes and components

### 7. Testing Architecture
**End-to-End Testing**:
- **Playwright**: Browser automation for E2E testing
- **Bun Test Runner**: Native test runner for consistency with project runtime
- **Test Structure**: Organized in `tests/e2e/` directory
- **API Testing**: Automated testing of oRPC endpoints through browser interface
- **UI Testing**: Component interaction and workflow validation
- **Integration Testing**: Full user journey testing from frontend to backend
- **Performance**: Faster test execution compared to Jest-based solutions

## Development Workflow

### Build System
Turborepo manages the build pipeline with:
- **Parallel execution**: Multiple apps build simultaneously
- **Incremental builds**: Only changed packages rebuild
- **Dependency graph**: Proper build ordering
- **Caching**: Build artifacts cached for faster subsequent builds

### Available Scripts
- `bun run dev`: Start all applications in development mode
- `bun run dev:server`: Start only the server (port 3000)
- `bun run dev:web`: Start only the web app (port 3001)
- `bun run build`: Build all applications
- `bun run check`: Run Biome linting and formatting
- `bun run test:e2e`: Run Playwright end-to-end tests

### Database Operations
- `bun run db:push`: Push schema changes to database
- `bun run db:studio`: Open Drizzle Studio for database inspection
- `bun run db:generate`: Generate migration files
- `bun run db:migrate`: Run database migrations

## Security Considerations

### Authentication Security
- HTTP-only cookies for session management
- Secure cookie attributes for production
- CORS origin validation
- Session tracking with IP and user agent

### API Security
- Type-safe API endpoints with oRPC
- Protected procedures with authentication middleware
- Input validation with Zod schemas
- Error handling without information leakage

## Performance Optimizations

### Frontend Performance
- Next.js App Router for optimal loading
- Component code splitting
- Image optimization with Next.js Image component
- CSS-in-JS with minimal runtime overhead

### Backend Performance
- SQLite for fast local development
- Connection pooling with LibSQL client
- Efficient query patterns with Drizzle ORM
- Caching strategies with TanStack Query

### Build Performance
- Turborepo caching for faster builds
- Turbopack for faster development builds
- Incremental TypeScript compilation
- Parallel task execution

## Deployment Architecture

The project is configured for flexible deployment options:
- **Database**: SQLite (development) with migration path to production databases
- **Server Deployment**: Next.js API routes (serverless-ready)
- **Frontend Deployment**: Static generation and server-side rendering
- **Environment**: Environment variable configuration for different stages

## Extension Points

### Adding New Features
1. **Database Changes**: Add schemas in `apps/server/src/db/schema/`
2. **API Endpoints**: Create procedures in `apps/server/src/routers/`
3. **UI Components**: Add to `apps/web/src/components/`
4. **Pages**: Create in `apps/web/src/app/`

### Adding New Apps
The monorepo structure supports additional applications:
1. Create new app in `apps/` directory
2. Add to workspace configuration
3. Update Turborepo pipeline configuration
4. Configure shared dependencies

## Configuration Files

### Key Configuration Files
- **`turbo.json`**: Build pipeline and task dependencies
- **`biome.json`**: Linting and formatting rules
- **`bts.jsonc`**: Better-T-Stack project configuration
- **`drizzle.config.ts`**: Database configuration and migrations
- **Environment files**: Development and production environment variables

This architecture provides a solid foundation for a scalable, type-safe, and maintainable full-stack application with modern development practices and tools.