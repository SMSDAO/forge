export type WorkspaceRole = "owner" | "admin" | "developer" | "designer" | "viewer"

export const WORKSPACE_ROLES: Record<WorkspaceRole, { label: string; description: string; permissions: string[] }> = {
  owner: { label: "Owner", description: "Full workspace control", permissions: ["read", "write", "deploy", "manage_members", "manage_settings"] },
  admin: { label: "Admin", description: "Manage code and deployments", permissions: ["read", "write", "deploy", "manage_settings"] },
  developer: { label: "Developer", description: "Edit code and run previews", permissions: ["read", "write", "preview"] },
  designer: { label: "Designer", description: "Edit UI and preview changes", permissions: ["read", "write", "preview"] },
  viewer: { label: "Viewer", description: "Read-only workspace access", permissions: ["read", "preview"] },
}

export function can(role: WorkspaceRole, permission: string) {
  return WORKSPACE_ROLES[role].permissions.includes(permission)
}
