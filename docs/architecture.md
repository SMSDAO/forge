# FORGES Architecture

## Overview

FORGES is a Next.js 16 enterprise platform for building, deploying, and managing applications with AI assistance.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Components | Radix UI primitives |
| Styling | Tailwind CSS 4 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| Package Manager | pnpm |
| Language | TypeScript 5.7 |

## Directory Structure

```
forge/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── chat/          # AI chat endpoint
│   │   └── health/        # Health check endpoint
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin dashboard
│   ├── developer/         # Developer dashboard
│   ├── users/             # User management (admin)
│   ├── settings/          # Account settings
│   ├── docs/              # Documentation
│   ├── login/             # Authentication
│   ├── register/          # Registration
│   ├── ide/               # IDE interface
│   └── layout.tsx         # Root layout
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── ide/               # IDE components
│   ├── landing/           # Landing page
│   ├── settings/          # Settings components
│   ├── shell/             # App navigation shell
│   └── ui/                # Radix UI component library
├── lib/
│   ├── actions.ts         # Server actions (CRUD)
│   ├── ai-models.ts       # AI model definitions
│   ├── db.ts              # Data access layer
│   ├── migrations.ts      # SQL schema/migrations
│   ├── rbac.ts            # Role-based access control
│   └── utils.ts           # Shared utilities
├── hooks/                 # React hooks
├── public/                # Static assets
└── docs/                  # Documentation
```

## RBAC Roles

| Role | Description |
|------|-------------|
| Admin | Full control: users, billing, config, deployments |
| Developer | Code, deployments, AI features |
| Reviewer | Read-only code + AI chat |
| Viewer | Read-only access |
| Billing | Billing and subscription management |

## Data Flow

1. Pages are server components fetching data via `lib/actions.ts`
2. Interactive UI runs in client components
3. In-memory store (lib/db.ts) used for development
4. Replace db.ts bodies with real DB driver for production (PostgreSQL/Neon/Supabase)

## Security

- HTTP security headers via `middleware.ts`
- RBAC enforcement via `lib/rbac.ts`
- Input validation via Zod schemas in `lib/actions.ts`
