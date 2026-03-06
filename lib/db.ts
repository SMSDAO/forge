/**
 * lib/db.ts
 * Typed data-access layer for Forge domain entities.
 *
 * All functions are pure, side-effect-free outside DB access, and strictly typed.
 * No `any` types are used.
 *
 * The current implementation uses an in-memory store suitable for development
 * and testing. To connect to a real database (Supabase, Neon, etc.), replace
 * the function bodies below with the appropriate driver calls while keeping
 * all function signatures identical.
 *
 * Suggested env-vars for a real provider:
 *   - SUPABASE_URL + SUPABASE_ANON_KEY  (Supabase)
 *   - DATABASE_URL                       (Neon, RDS, etc.)
 */

// ─────────────────────────────────────────────
//  Domain entity types
// ─────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  ownerId: string
  name: string
  description: string | null
  template: string | null
  status: "active" | "archived" | "draft"
  createdAt: Date
  updatedAt: Date
}

export interface ProjectFile {
  id: string
  projectId: string
  path: string
  language: string
  content: string
  size: number
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  projectId: string
  threadId: string
  role: "user" | "assistant" | "system"
  content: string
  agentId: string | null
  modelId: string | null
  codeBlocks: CodeBlock[]
  createdAt: Date
}

export interface CodeBlock {
  language: string
  code: string
  filename: string | null
}

export interface Deployment {
  id: string
  projectId: string
  status: "queued" | "building" | "success" | "failed" | "cancelled"
  url: string | null
  commitSha: string | null
  commitMessage: string | null
  buildLogs: string | null
  createdAt: Date
  updatedAt: Date
}

// ─────────────────────────────────────────────
//  Input / result types
// ─────────────────────────────────────────────

export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">
export type UpdateUserInput = Partial<Omit<User, "id" | "createdAt" | "updatedAt">>

export type CreateProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">
export type UpdateProjectInput = Partial<Omit<Project, "id" | "ownerId" | "createdAt" | "updatedAt">>

export type CreateProjectFileInput = Omit<ProjectFile, "id" | "createdAt" | "updatedAt" | "size"> & { size?: number }
export type UpdateProjectFileInput = Partial<Omit<ProjectFile, "id" | "projectId" | "createdAt" | "updatedAt">>

export type CreateMessageInput = Omit<Message, "id" | "createdAt">
export type CreateDeploymentInput = Omit<Deployment, "id" | "createdAt" | "updatedAt">
export type UpdateDeploymentInput = Partial<Omit<Deployment, "id" | "projectId" | "createdAt" | "updatedAt">>

export interface DbResult<T> {
  data: T | null
  error: string | null
}

export interface DbListResult<T> {
  data: T[]
  error: string | null
}

// ─────────────────────────────────────────────
//  In-memory store (development / CI fallback)
// ─────────────────────────────────────────────

interface InMemoryStore {
  users: Map<string, User>
  projects: Map<string, Project>
  projectFiles: Map<string, ProjectFile>
  messages: Map<string, Message>
  deployments: Map<string, Deployment>
}

function createStore(): InMemoryStore {
  const now = new Date()
  const users = new Map<string, User>()
  const projects = new Map<string, Project>()
  const projectFiles = new Map<string, ProjectFile>()
  const messages = new Map<string, Message>()
  const deployments = new Map<string, Deployment>()

  // Seed data so pages render with real-looking content immediately
  const userId = "user-1"
  users.set(userId, {
    id: userId,
    email: "dev@forge.app",
    name: "Forge Dev",
    avatarUrl: null,
    createdAt: now,
    updatedAt: now,
  })

  const projectSeeds: Project[] = [
    {
      id: "proj-1",
      ownerId: userId,
      name: "My Forge App",
      description: "Main application built with Next.js and Tailwind",
      template: "nextjs",
      status: "active",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: "proj-2",
      ownerId: userId,
      name: "API Service",
      description: "REST API built with Next.js App Router",
      template: "api",
      status: "active",
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "proj-3",
      ownerId: userId,
      name: "Landing Page",
      description: "Marketing site with animations",
      template: "landing",
      status: "draft",
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    },
  ]
  for (const p of projectSeeds) projects.set(p.id, p)

  // Seed files for proj-1
  const fileSeeds: ProjectFile[] = [
    {
      id: "file-1",
      projectId: "proj-1",
      path: "page.tsx",
      language: "tsx",
      content: `export default function Home() {\n  return <main>Hello Forge</main>\n}`,
      size: 52,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "file-2",
      projectId: "proj-1",
      path: "layout.tsx",
      language: "tsx",
      content: `export default function Layout({ children }: { children: React.ReactNode }) {\n  return <html><body>{children}</body></html>\n}`,
      size: 98,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "file-3",
      projectId: "proj-1",
      path: "globals.css",
      language: "css",
      content: `@import 'tailwindcss';`,
      size: 21,
      createdAt: now,
      updatedAt: now,
    },
  ]
  for (const f of fileSeeds) projectFiles.set(f.id, f)

  // Seed deployments for proj-1
  const deploymentSeeds: Deployment[] = [
    {
      id: "deploy-1",
      projectId: "proj-1",
      status: "success",
      url: "https://my-forge-app.vercel.app",
      commitSha: "abc1234",
      commitMessage: "Initial deploy",
      buildLogs: "Build completed successfully in 42s",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "deploy-2",
      projectId: "proj-1",
      status: "failed",
      url: null,
      commitSha: "def5678",
      commitMessage: "Add new feature",
      buildLogs: "Error: Module not found",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  ]
  for (const d of deploymentSeeds) deployments.set(d.id, d)

  // Seed a thread + message for proj-1
  const threadId = "thread-1"
  const msgSeed: Message = {
    id: "msg-1",
    projectId: "proj-1",
    threadId,
    role: "assistant",
    content: "Welcome to Forge! How can I help you build something amazing today?",
    agentId: "forge-coder",
    modelId: "gemini-2.0-flash",
    codeBlocks: [],
    createdAt: now,
  }
  messages.set(msgSeed.id, msgSeed)

  return { users, projects, projectFiles, messages, deployments }
}

// Singleton store — reset between tests by calling resetStore()
let _store: InMemoryStore | null = null

function getStore(): InMemoryStore {
  if (!_store) _store = createStore()
  return _store
}

/** Reset the in-memory store. Useful in tests. */
export function resetStore(): void {
  _store = null
}

// ─────────────────────────────────────────────
//  Utility
// ─────────────────────────────────────────────

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function ok<T>(data: T): DbResult<T> {
  return { data, error: null }
}

function err<T>(message: string): DbResult<T> {
  return { data: null, error: message }
}

function listOk<T>(data: T[]): DbListResult<T> {
  return { data, error: null }
}

function listErr<T>(message: string): DbListResult<T> {
  return { data: [], error: message }
}

// ─────────────────────────────────────────────
//  User functions
// ─────────────────────────────────────────────

export async function getUser(id: string): Promise<DbResult<User>> {
  try {
    const user = getStore().users.get(id)
    return user ? ok(user) : err("User not found")
  } catch (e) {
    console.error("getUser error", e)
    return err("Internal error")
  }
}

export async function getUserByEmail(email: string): Promise<DbResult<User>> {
  try {
    const user = Array.from(getStore().users.values()).find(u => u.email === email)
    return user ? ok(user) : err("User not found")
  } catch (e) {
    console.error("getUserByEmail error", e)
    return err("Internal error")
  }
}

export async function createUser(input: CreateUserInput): Promise<DbResult<User>> {
  try {
    const store = getStore()
    const existing = Array.from(store.users.values()).find(u => u.email === input.email)
    if (existing) return err("User with this email already exists")
    const now = new Date()
    const user: User = { ...input, id: newId(), createdAt: now, updatedAt: now }
    store.users.set(user.id, user)
    return ok(user)
  } catch (e) {
    console.error("createUser error", e)
    return err("Internal error")
  }
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<DbResult<User>> {
  try {
    const store = getStore()
    const existing = store.users.get(id)
    if (!existing) return err("User not found")
    const updated: User = { ...existing, ...input, id, updatedAt: new Date() }
    store.users.set(id, updated)
    return ok(updated)
  } catch (e) {
    console.error("updateUser error", e)
    return err("Internal error")
  }
}

// ─────────────────────────────────────────────
//  Project functions
// ─────────────────────────────────────────────

export async function listProjects(ownerId: string): Promise<DbListResult<Project>> {
  try {
    const projects = Array.from(getStore().projects.values())
      .filter(p => p.ownerId === ownerId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    return listOk(projects)
  } catch (e) {
    console.error("listProjects error", e)
    return listErr("Internal error")
  }
}

export async function getProject(id: string): Promise<DbResult<Project>> {
  try {
    const project = getStore().projects.get(id)
    return project ? ok(project) : err("Project not found")
  } catch (e) {
    console.error("getProject error", e)
    return err("Internal error")
  }
}

export async function createProject(input: CreateProjectInput): Promise<DbResult<Project>> {
  try {
    const now = new Date()
    const project: Project = { ...input, id: newId(), createdAt: now, updatedAt: now }
    getStore().projects.set(project.id, project)
    return ok(project)
  } catch (e) {
    console.error("createProject error", e)
    return err("Internal error")
  }
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<DbResult<Project>> {
  try {
    const store = getStore()
    const existing = store.projects.get(id)
    if (!existing) return err("Project not found")
    const updated: Project = { ...existing, ...input, id, updatedAt: new Date() }
    store.projects.set(id, updated)
    return ok(updated)
  } catch (e) {
    console.error("updateProject error", e)
    return err("Internal error")
  }
}

export async function deleteProject(id: string): Promise<DbResult<void>> {
  try {
    const store = getStore()
    if (!store.projects.has(id)) return err("Project not found")
    store.projects.delete(id)
    // cascade delete files, messages, deployments
    for (const [k, f] of store.projectFiles) { if (f.projectId === id) store.projectFiles.delete(k) }
    for (const [k, m] of store.messages) { if (m.projectId === id) store.messages.delete(k) }
    for (const [k, d] of store.deployments) { if (d.projectId === id) store.deployments.delete(k) }
    return ok(undefined)
  } catch (e) {
    console.error("deleteProject error", e)
    return err("Internal error")
  }
}

// ─────────────────────────────────────────────
//  ProjectFile functions
// ─────────────────────────────────────────────

export async function listProjectFiles(projectId: string): Promise<DbListResult<ProjectFile>> {
  try {
    const files = Array.from(getStore().projectFiles.values())
      .filter(f => f.projectId === projectId)
      .sort((a, b) => a.path.localeCompare(b.path))
    return listOk(files)
  } catch (e) {
    console.error("listProjectFiles error", e)
    return listErr("Internal error")
  }
}

export async function getProjectFile(id: string): Promise<DbResult<ProjectFile>> {
  try {
    const file = getStore().projectFiles.get(id)
    return file ? ok(file) : err("File not found")
  } catch (e) {
    console.error("getProjectFile error", e)
    return err("Internal error")
  }
}

export async function getProjectFileByPath(projectId: string, path: string): Promise<DbResult<ProjectFile>> {
  try {
    const file = Array.from(getStore().projectFiles.values()).find(
      f => f.projectId === projectId && f.path === path
    )
    return file ? ok(file) : err("File not found")
  } catch (e) {
    console.error("getProjectFileByPath error", e)
    return err("Internal error")
  }
}

export async function createProjectFile(input: CreateProjectFileInput): Promise<DbResult<ProjectFile>> {
  try {
    const store = getStore()
    const duplicate = Array.from(store.projectFiles.values()).find(
      f => f.projectId === input.projectId && f.path === input.path
    )
    if (duplicate) return err("A file with this path already exists in the project")
    const now = new Date()
    const size = input.size ?? new TextEncoder().encode(input.content).length
    const file: ProjectFile = { ...input, id: newId(), size, createdAt: now, updatedAt: now }
    store.projectFiles.set(file.id, file)
    return ok(file)
  } catch (e) {
    console.error("createProjectFile error", e)
    return err("Internal error")
  }
}

export async function updateProjectFile(id: string, input: UpdateProjectFileInput): Promise<DbResult<ProjectFile>> {
  try {
    const store = getStore()
    const existing = store.projectFiles.get(id)
    if (!existing) return err("File not found")
    // Enforce path uniqueness when path is being changed
    if (input.path && input.path !== existing.path) {
      const duplicate = Array.from(store.projectFiles.values()).find(
        f => f.id !== id && f.projectId === existing.projectId && f.path === input.path
      )
      if (duplicate) return err("A file with this path already exists in the project")
    }
    const content = input.content ?? existing.content
    const updated: ProjectFile = {
      ...existing,
      ...input,
      id,
      size: new TextEncoder().encode(content).length,
      updatedAt: new Date(),
    }
    store.projectFiles.set(id, updated)
    return ok(updated)
  } catch (e) {
    console.error("updateProjectFile error", e)
    return err("Internal error")
  }
}

export async function deleteProjectFile(id: string): Promise<DbResult<void>> {
  try {
    const store = getStore()
    if (!store.projectFiles.has(id)) return err("File not found")
    store.projectFiles.delete(id)
    return ok(undefined)
  } catch (e) {
    console.error("deleteProjectFile error", e)
    return err("Internal error")
  }
}

// ─────────────────────────────────────────────
//  Message functions
// ─────────────────────────────────────────────

export async function listMessages(projectId: string, threadId?: string): Promise<DbListResult<Message>> {
  try {
    const messages = Array.from(getStore().messages.values())
      .filter(m => m.projectId === projectId && (threadId === undefined || m.threadId === threadId))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    return listOk(messages)
  } catch (e) {
    console.error("listMessages error", e)
    return listErr("Internal error")
  }
}

export async function getMessage(id: string): Promise<DbResult<Message>> {
  try {
    const msg = getStore().messages.get(id)
    return msg ? ok(msg) : err("Message not found")
  } catch (e) {
    console.error("getMessage error", e)
    return err("Internal error")
  }
}

export async function createMessage(input: CreateMessageInput): Promise<DbResult<Message>> {
  try {
    const message: Message = { ...input, id: newId(), createdAt: new Date() }
    getStore().messages.set(message.id, message)
    return ok(message)
  } catch (e) {
    console.error("createMessage error", e)
    return err("Internal error")
  }
}

export async function deleteMessage(id: string): Promise<DbResult<void>> {
  try {
    const store = getStore()
    if (!store.messages.has(id)) return err("Message not found")
    store.messages.delete(id)
    return ok(undefined)
  } catch (e) {
    console.error("deleteMessage error", e)
    return err("Internal error")
  }
}

// ─────────────────────────────────────────────
//  Deployment functions
// ─────────────────────────────────────────────

export async function listDeployments(projectId: string): Promise<DbListResult<Deployment>> {
  try {
    const deployments = Array.from(getStore().deployments.values())
      .filter(d => d.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    return listOk(deployments)
  } catch (e) {
    console.error("listDeployments error", e)
    return listErr("Internal error")
  }
}

export async function getDeployment(id: string): Promise<DbResult<Deployment>> {
  try {
    const deployment = getStore().deployments.get(id)
    return deployment ? ok(deployment) : err("Deployment not found")
  } catch (e) {
    console.error("getDeployment error", e)
    return err("Internal error")
  }
}

export async function createDeployment(input: CreateDeploymentInput): Promise<DbResult<Deployment>> {
  try {
    const now = new Date()
    const deployment: Deployment = { ...input, id: newId(), createdAt: now, updatedAt: now }
    getStore().deployments.set(deployment.id, deployment)
    return ok(deployment)
  } catch (e) {
    console.error("createDeployment error", e)
    return err("Internal error")
  }
}

export async function updateDeployment(id: string, input: UpdateDeploymentInput): Promise<DbResult<Deployment>> {
  try {
    const store = getStore()
    const existing = store.deployments.get(id)
    if (!existing) return err("Deployment not found")
    const updated: Deployment = { ...existing, ...input, id, updatedAt: new Date() }
    store.deployments.set(id, updated)
    return ok(updated)
  } catch (e) {
    console.error("updateDeployment error", e)
    return err("Internal error")
  }
}
