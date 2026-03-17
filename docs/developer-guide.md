# Developer Guide

## Overview

The Developer Dashboard provides tools for API monitoring, log inspection, environment management, and deployment diagnostics.

Access: Navigate to **Developer** in the navigation bar (requires Developer role).

## API Monitoring

View real-time latency percentiles (p50, p95, p99) over the last 60 minutes.

### Integration Test Console

Send test requests to the API directly from the browser:
1. Enter a JSON payload in the input field
2. Click **Run** to execute the test
3. View the response below the input

## Log Viewer

Real-time application logs with color-coded log levels:
- `INFO` — informational messages
- `WARN` — warning conditions
- `ERROR` — error conditions

Click **Refresh** to fetch the latest logs.

## Environment Variables

View current environment configuration. Secret values are masked.

## Deployment Diagnostics

View recent deployments with:
- Branch name and commit SHA
- Build status (success / building / failed)
- Build duration
- Time since deployment

## Local Development

```bash
# Install dependencies
pnpm install

# Start dev server with hot reload
pnpm dev

# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Build
pnpm build
```

## Adding New API Routes

Create files in `app/api/<route>/route.ts`:

```ts
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Hello" })
}
```

## Adding New Pages

1. Create `app/<route>/page.tsx`
2. Wrap with `<AppShell>` for navigation
3. Export `metadata` for SEO

## RBAC Integration

Use `lib/rbac.ts` to check permissions:

```ts
import { hasPermission } from "@/lib/rbac"

if (!hasPermission(userRole, "billing:manage")) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
```
