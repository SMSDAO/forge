/**
 * lib/migrations.ts
 * Schema migration definitions for Forge domain entities.
 *
 * These migrations describe the DDL required to materialize the schema
 * in a real Postgres-compatible database (Supabase, Neon, PlanetScale, etc.).
 *
 * How to apply:
 *   1. Set DB_PROVIDER and the relevant connection env-vars.
 *   2. Run: `npx ts-node lib/migrations.ts` (or use your ORM's migration runner).
 *
 * Migrations are ordered and idempotent — they use CREATE TABLE IF NOT EXISTS.
 */

export interface Migration {
  id: string
  name: string
  sql: string
  createdAt: string
}

export const MIGRATIONS: Migration[] = [
  {
    id: "001",
    name: "create_users_table",
    createdAt: "2026-02-15",
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id          TEXT        PRIMARY KEY,
        email       TEXT        NOT NULL UNIQUE,
        name        TEXT,
        avatar_url  TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    id: "002",
    name: "create_projects_table",
    createdAt: "2026-02-16",
    sql: `
      CREATE TABLE IF NOT EXISTS projects (
        id          TEXT        PRIMARY KEY,
        owner_id    TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name        TEXT        NOT NULL,
        description TEXT,
        template    TEXT,
        status      TEXT        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'archived', 'draft')),
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON projects(owner_id);
    `,
  },
  {
    id: "003",
    name: "create_project_files_table",
    createdAt: "2026-02-20",
    sql: `
      CREATE TABLE IF NOT EXISTS project_files (
        id          TEXT        PRIMARY KEY,
        project_id  TEXT        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        path        TEXT        NOT NULL,
        language    TEXT        NOT NULL,
        content     TEXT        NOT NULL DEFAULT '',
        size        INTEGER     NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (project_id, path)
      );
      CREATE INDEX IF NOT EXISTS project_files_project_id_idx ON project_files(project_id);
    `,
  },
  {
    id: "004",
    name: "create_messages_table",
    createdAt: "2026-02-22",
    sql: `
      CREATE TABLE IF NOT EXISTS messages (
        id          TEXT        PRIMARY KEY,
        project_id  TEXT        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        thread_id   TEXT        NOT NULL,
        role        TEXT        NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
        content     TEXT        NOT NULL,
        agent_id    TEXT,
        model_id    TEXT,
        code_blocks JSONB       NOT NULL DEFAULT '[]',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS messages_project_id_thread_id_idx
        ON messages(project_id, thread_id);
    `,
  },
  {
    id: "005",
    name: "create_deployments_table",
    createdAt: "2026-03-04",
    sql: `
      CREATE TABLE IF NOT EXISTS deployments (
        id              TEXT        PRIMARY KEY,
        project_id      TEXT        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        status          TEXT        NOT NULL DEFAULT 'queued'
                        CHECK (status IN ('queued', 'building', 'success', 'failed', 'cancelled')),
        url             TEXT,
        commit_sha      TEXT,
        commit_message  TEXT,
        build_logs      TEXT,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS deployments_project_id_idx ON deployments(project_id);
    `,
  },
]

/** Returns the SQL to apply all pending migrations in order. */
export function getMigrationSql(): string {
  return MIGRATIONS.map(m => `-- Migration ${m.id}: ${m.name}\n${m.sql.trim()}`).join("\n\n")
}
