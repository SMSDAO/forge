# FORGES — Build. Deploy. Ship.

> Enterprise platform for building, deploying, and managing applications with AI assistance, GitHub workflows, and instant cloud deployment.

[![CI](https://github.com/SMSDAO/forge/actions/workflows/ci.yml/badge.svg)](https://github.com/SMSDAO/forge/actions/workflows/ci.yml)

---

## Features

- **🤖 AI-Powered IDE** — Integrated development environment with AI chat and code generation
- **🚀 One-Click Deployments** — Build and deploy directly from the browser
- **👥 RBAC Access Control** — Admin, Developer, Reviewer, Viewer, and Billing roles
- **📊 Enterprise Dashboards** — User, Admin, and Developer dashboards with real-time metrics
- **💳 Billing & Metering** — Metered usage tracking with plan limits and overage controls
- **🔒 Security Hardened** — Security headers, input validation, rate limiting, CSRF protection
- **📱 Mobile-Ready** — Responsive design with touch-optimized bottom tab navigation
- **📦 PWA Support** — Installable as a Progressive Web App

---

## UI Preview

### User Dashboard

![User Dashboard](https://github.com/user-attachments/assets/9fe00c61-78a4-4314-ad89-6e27a783548b)

> Overview cards, activity metrics chart, notifications, and metered usage panel.

### Admin Dashboard

![Admin Dashboard](https://github.com/user-attachments/assets/350bb60c-c625-4bb1-92c6-c1b4fa511d84)

> User/role management, billing controls, API monitoring, audit logs, and system configuration.

---

## Navigation

| Tab | Path | Access |
|-----|------|--------|
| Home | `/` | All users |
| Dashboard | `/dashboard` | All users |
| Users | `/users` | Admin |
| Admin | `/admin` | Admin |
| Developer | `/developer` | Developer+ |
| Settings | `/settings` | All users |
| Docs | `/docs` | All users |

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Start development server
pnpm dev
```

Visit `http://localhost:3000`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Components | Radix UI |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Icons | Lucide React |
| Package Manager | pnpm |
| Language | TypeScript 5.7 |

---

## Project Structure

```
forge/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (chat, health)
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin dashboard
│   ├── developer/         # Developer dashboard
│   ├── users/             # User management
│   ├── settings/          # Account settings
│   ├── docs/              # Documentation
│   ├── login/             # Authentication
│   ├── register/          # Registration
│   └── ide/               # AI-powered IDE
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── ide/               # IDE components
│   ├── landing/           # Landing page
│   ├── settings/          # Settings components
│   ├── shell/             # Navigation shell
│   └── ui/                # Radix UI component library
├── lib/
│   ├── actions.ts         # Server actions
│   ├── db.ts              # Data access layer
│   ├── rbac.ts            # Role-based access control
│   └── migrations.ts      # Database migrations
├── docs/                  # Documentation
│   ├── architecture.md
│   ├── deployment.md
│   ├── env-vars.md
│   ├── user-guide.md
│   ├── admin-guide.md
│   └── developer-guide.md
└── .github/workflows/     # CI/CD pipelines
```

---

## RBAC Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full control: users, billing, config, deployments |
| **Developer** | Code, deployments, AI features, developer tools |
| **Reviewer** | Read-only code + AI chat |
| **Viewer** | Read-only project access |
| **Billing** | Billing and subscription management |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | System health check |
| `/api/chat` | POST | AI chat endpoint |

### Health Response

```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-03-15T00:00:00.000Z",
  "uptime": 3600
}
```

---

## Environment Variables

See [`.env.example`](.env.example) for the full list. Minimum required:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
AUTH_SECRET=<openssl rand -base64 32>
```

---

## Documentation

- [Architecture](docs/architecture.md)
- [Deployment Guide](docs/deployment.md)
- [Environment Variables](docs/env-vars.md)
- [User Guide](docs/user-guide.md)
- [Admin Guide](docs/admin-guide.md)
- [Developer Guide](docs/developer-guide.md)
- [Changelog](CHANGELOG.md)

---

## CI/CD

Pipelines run on every push and pull request:

| Workflow | Triggers | Jobs |
|---------|---------|------|
| `ci.yml` | push, pull_request | Lint + Typecheck, Next.js Build |
| `release.yml` | tag `v*.*.*` | Build + GitHub Release |

---

## Security

- HTTP security headers via `proxy.ts` (X-Frame-Options, CSP, HSTS, Permissions-Policy)
- RBAC enforcement on all protected routes
- Input validation via Zod schemas
- Passwords hashed server-side
- No secrets committed to source control

---

## License

MIT © SMSDAO
