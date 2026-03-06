/**
 * lib/db.ts
 *
 * Minimal, portable database utility for Forge IDE.
 *
 * Supports multiple backends via environment variables:
 *   - Supabase:    SUPABASE_URL + SUPABASE_ANON_KEY
 *   - Generic SQL: DATABASE_URL (Postgres, MySQL, SQLite via compatible client)
 *
 * Usage:
 *   import { getDbConfig, isDbConfigured } from "@/lib/db"
 *
 * For full database access, configure the appropriate environment variables
 * and install the matching client library (e.g., @supabase/supabase-js).
 */

export type DbProvider = "supabase" | "postgres" | "mysql" | "sqlite" | "none"

export interface DbConfig {
  provider: DbProvider
  configured: boolean
  /** Masked URL for display purposes (never exposes credentials) */
  displayUrl: string
}

/** Returns the active database configuration based on environment variables. */
export function getDbConfig(): DbConfig {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    return {
      provider: "supabase",
      configured: true,
      displayUrl: maskUrl(process.env.SUPABASE_URL),
    }
  }

  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL
    const provider = inferSqlProvider(url)
    return {
      provider,
      configured: true,
      displayUrl: maskUrl(url),
    }
  }

  return { provider: "none", configured: false, displayUrl: "" }
}

/** Returns true if a database is configured via environment variables. */
export function isDbConfigured(): boolean {
  return getDbConfig().configured
}

/**
 * Masks credentials in a database URL for safe display.
 * Example: postgres://user:secret@host/db → postgres://***@host/db
 */
function maskUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.password) parsed.password = "***"
    if (parsed.username) parsed.username = "***"
    return parsed.toString()
  } catch {
    // Not a valid URL (e.g., sqlite file path) — return as-is
    return url
  }
}

function inferSqlProvider(url: string): DbProvider {
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) return "postgres"
  if (url.startsWith("mysql://")) return "mysql"
  if (url.startsWith("file:") || url.endsWith(".db") || url.endsWith(".sqlite")) return "sqlite"
  return "postgres"
}

/**
 * Domain entities implied by the Forge IDE UI.
 * These types describe the shape of data shown in the Database Panel
 * and can be used with any compatible ORM or query builder.
 */

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
}

export interface Project {
  id: string
  name: string
  owner_id: string
  status: "active" | "archived" | "building"
  created_at: string
}

export interface Message {
  id: string
  project_id: string
  user_id: string
  content: string
  role: "user" | "assistant"
  created_at: string
}

export interface ProjectFile {
  id: string
  project_id: string
  path: string
  content: string
  language: string
}

export interface Deployment {
  id: string
  project_id: string
  status: "pending" | "building" | "success" | "failed"
  url: string | null
  created_at: string
}
