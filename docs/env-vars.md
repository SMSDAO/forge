# Environment Variables

## Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Public URL of the application | `https://forge.example.com` |
| `AUTH_SECRET` | Secret for signing auth tokens (32+ chars) | `openssl rand -base64 32` |

## Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | In-memory store |
| `NODE_ENV` | Environment mode | `development` |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID | Disabled |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app secret | Disabled |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Disabled |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Disabled |
| `OPENAI_API_KEY` | OpenAI API key for AI chat | None |
| `ANTHROPIC_API_KEY` | Anthropic API key | None |
| `STRIPE_SECRET_KEY` | Stripe secret key for billing | None |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `60000` |

## Setting Up

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

Never commit `.env.local` to version control.
