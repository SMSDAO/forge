# Deployment Guide

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL (production) or use in-memory store (development)

## Local Development

```bash
# Install dependencies
pnpm install

# Copy env template
cp .env.example .env.local

# Start development server
pnpm dev
```

## Environment Setup

See [.env.example](../.env.example) for all required environment variables.

Minimum required for production:
- `NEXT_PUBLIC_APP_URL` — your deployment URL
- `AUTH_SECRET` — random 32-byte secret for auth

## Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Vercel Deployment

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

## Docker (optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## Health Check

The application exposes a health endpoint at `/api/health`:

```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-03-15T00:00:00.000Z",
  "uptime": 3600
}
```
