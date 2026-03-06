/**
 * Role-Based Access Control (RBAC) system for Forge IDE.
 * Defines user roles, permissions, and helper utilities.
 */

/**
 * Represents the access level of a user within a project workspace.
 * - `admin`:     Full control over the project, team, settings, and billing.
 * - `developer`: Can create/edit code, run deployments, and use AI features.
 * - `reviewer`:  Read-only access to code and deployments; can use AI chat.
 * - `viewer`:    Read-only access to project content with no AI or edit access.
 * - `billing`:   Manages billing and subscription settings; limited code access.
 */
export type UserRole = "admin" | "developer" | "reviewer" | "viewer" | "billing"

/**
 * Granular permissions used across the Forge IDE, organized by resource:action
 * namespace. Each role is granted a fixed subset of these permissions.
 *
 * Resource namespaces:
 * - `project`    – top-level project management
 * - `file`       – virtual file system operations
 * - `deployment` – build and deployment pipeline
 * - `ai`         – AI chat and model configuration
 * - `team`       – team membership management
 * - `billing`    – subscription and payment management
 * - `settings`   – workspace configuration
 */
export type Permission =
  | "project:create"
  | "project:read"
  | "project:update"
  | "project:delete"
  | "file:create"
  | "file:read"
  | "file:update"
  | "file:delete"
  | "deployment:create"
  | "deployment:read"
  | "deployment:rollback"
  | "ai:chat"
  | "ai:models:manage"
  | "team:read"
  | "team:invite"
  | "team:remove"
  | "billing:read"
  | "billing:manage"
  | "settings:read"
  | "settings:manage"

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "project:create", "project:read", "project:update", "project:delete",
    "file:create", "file:read", "file:update", "file:delete",
    "deployment:create", "deployment:read", "deployment:rollback",
    "ai:chat", "ai:models:manage",
    "team:read", "team:invite", "team:remove",
    "billing:read", "billing:manage",
    "settings:read", "settings:manage",
  ],
  developer: [
    "project:create", "project:read", "project:update",
    "file:create", "file:read", "file:update", "file:delete",
    "deployment:create", "deployment:read",
    "ai:chat",
    "team:read",
    "settings:read",
  ],
  reviewer: [
    "project:read",
    "file:read",
    "deployment:read",
    "ai:chat",
    "team:read",
    "settings:read",
  ],
  viewer: [
    "project:read",
    "file:read",
    "deployment:read",
    "team:read",
  ],
  billing: [
    "project:read",
    "billing:read", "billing:manage",
    "team:read",
    "settings:read",
  ],
}

/** Returns true if the given role has the specified permission. */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/** Returns all permissions for a given role. */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

/** Human-readable label for a role. */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: "Admin",
    developer: "Developer",
    reviewer: "Reviewer",
    viewer: "Viewer",
    billing: "Billing",
  }
  return labels[role]
}

/** Badge color for each role (used in the IDE UI). */
export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    admin: "#06b6d4",
    developer: "#06b6d4",
    reviewer: "#a78bfa",
    viewer: "#64748b",
    billing: "#f59e0b",
  }
  return colors[role]
}

/** Short initial / abbreviation for display in avatars. */
export function getRoleInitial(role: UserRole): string {
  const initials: Record<UserRole, string> = {
    admin: "A",
    developer: "D",
    reviewer: "R",
    viewer: "V",
    billing: "B",
  }
  return initials[role]
}

/**
 * Simple role hierarchy: returns true when `subject` has at least the
 * same level of access as `required`.
 * Order (highest → lowest): admin > developer > reviewer > viewer/billing
 */
const ROLE_RANK: Record<UserRole, number> = {
  admin: 4,
  developer: 3,
  reviewer: 2,
  billing: 1,
  viewer: 1,
}

export function roleAtLeast(subject: UserRole, required: UserRole): boolean {
  return ROLE_RANK[subject] >= ROLE_RANK[required]
}
