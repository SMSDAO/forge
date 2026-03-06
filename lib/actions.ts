"use server"

/**
 * lib/actions.ts
 * Typed server actions for Forge domain entities.
 *
 * All actions:
 *  - Validate inputs with Zod
 *  - Use typed DB functions from lib/db.ts
 *  - Return typed results or structured errors — never raw DB errors
 */

import { z } from "zod"
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  listProjectFiles,
  getProjectFile,
  createProjectFile,
  updateProjectFile,
  deleteProjectFile,
  listDeployments,
  getDeployment,
  createDeployment,
  updateDeployment,
  listMessages,
  createMessage,
  type Project,
  type ProjectFile,
  type Deployment,
  type Message,
} from "./db"

// ─────────────────────────────────────────────
//  Shared result type
// ─────────────────────────────────────────────

export interface ActionResult<T = void> {
  success: boolean
  data: T | null
  error: string | null
}

export interface ActionListResult<T> {
  success: boolean
  data: T[]
  error: string | null
}

function success<T>(data: T): ActionResult<T> {
  return { success: true, data, error: null }
}

function failure<T = void>(error: string): ActionResult<T> {
  return { success: false, data: null, error }
}

function listSuccess<T>(data: T[]): ActionListResult<T> {
  return { success: true, data, error: null }
}

function listFailure<T>(error: string): ActionListResult<T> {
  return { success: false, data: [], error }
}

function validationError<T = void>(issues: z.ZodIssue[]): ActionResult<T> {
  const msg = issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ")
  return failure(msg)
}

// ─────────────────────────────────────────────
//  Read actions
// ─────────────────────────────────────────────

export async function actionListProjects(ownerId: string): Promise<ActionListResult<Project>> {
  if (!ownerId) return listFailure("Owner ID is required")
  const result = await listProjects(ownerId)
  if (result.error) {
    console.error("actionListProjects: DB error", result.error)
    return listFailure("Failed to list projects")
  }
  return listSuccess(result.data)
}

export async function actionGetProject(id: string): Promise<ActionResult<Project>> {
  if (!id) return failure("Project ID is required")
  const result = await getProject(id)
  if (result.error) {
    console.error("actionGetProject: DB error", result.error)
    return failure("Failed to load project")
  }
  return success(result.data!)
}

export async function actionListFiles(projectId: string): Promise<ActionListResult<ProjectFile>> {
  if (!projectId) return listFailure("Project ID is required")
  const result = await listProjectFiles(projectId)
  if (result.error) {
    console.error("actionListFiles: DB error", result.error)
    return listFailure("Failed to list files")
  }
  return listSuccess(result.data)
}

export async function actionGetFile(id: string): Promise<ActionResult<ProjectFile>> {
  if (!id) return failure("File ID is required")
  const result = await getProjectFile(id)
  if (result.error) {
    console.error("actionGetFile: DB error", result.error)
    return failure("Failed to load file")
  }
  return success(result.data!)
}

export async function actionListDeployments(projectId: string): Promise<ActionListResult<Deployment>> {
  if (!projectId) return listFailure("Project ID is required")
  const result = await listDeployments(projectId)
  if (result.error) {
    console.error("actionListDeployments: DB error", result.error)
    return listFailure("Failed to list deployments")
  }
  return listSuccess(result.data)
}

export async function actionGetDeployment(id: string): Promise<ActionResult<Deployment>> {
  if (!id) return failure("Deployment ID is required")
  const result = await getDeployment(id)
  if (result.error) {
    console.error("actionGetDeployment: DB error", result.error)
    return failure("Failed to load deployment")
  }
  return success(result.data!)
}

export async function actionListMessages(
  projectId: string,
  threadId?: string
): Promise<ActionListResult<Message>> {
  if (!projectId) return listFailure("Project ID is required")
  const result = await listMessages(projectId, threadId)
  if (result.error) {
    console.error("actionListMessages: DB error", result.error)
    return listFailure("Failed to list messages")
  }
  return listSuccess(result.data)
}


//  Project actions
// ─────────────────────────────────────────────

const CreateProjectSchema = z.object({
  ownerId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  template: z.string().nullable().optional(),
  status: z.enum(["active", "archived", "draft"]).default("active"),
})

export async function actionCreateProject(
  formData: FormData | Record<string, unknown>
): Promise<ActionResult<Project>> {
  const raw = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData
  const parsed = CreateProjectSchema.safeParse(raw)
  if (!parsed.success) return validationError(parsed.error.issues)

  const result = await createProject({
    ownerId: parsed.data.ownerId,
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    template: parsed.data.template ?? null,
    status: parsed.data.status,
  })
  if (result.error) {
    console.error("actionCreateProject: DB error", result.error)
    return failure("Failed to create project")
  }
  return success(result.data!)
}

const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  template: z.string().nullable().optional(),
  status: z.enum(["active", "archived", "draft"]).optional(),
})

export async function actionUpdateProject(
  id: string,
  formData: FormData | Record<string, unknown>
): Promise<ActionResult<Project>> {
  if (!id) return failure("Project ID is required")
  const raw = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData
  const parsed = UpdateProjectSchema.safeParse(raw)
  if (!parsed.success) return validationError(parsed.error.issues)

  const result = await updateProject(id, parsed.data)
  if (result.error) {
    console.error("actionUpdateProject: DB error", result.error)
    return failure("Failed to update project")
  }
  return success(result.data!)
}

export async function actionDeleteProject(id: string): Promise<ActionResult> {
  if (!id) return failure("Project ID is required")
  const result = await deleteProject(id)
  if (result.error) {
    console.error("actionDeleteProject: DB error", result.error)
    return failure("Failed to delete project")
  }
  return success(undefined)
}

// ─────────────────────────────────────────────
//  ProjectFile actions
// ─────────────────────────────────────────────

const CreateFileSchema = z.object({
  projectId: z.string().min(1),
  path: z.string().min(1).max(500),
  language: z.string().min(1).max(50),
  content: z.string(),
})

export async function actionCreateFile(
  formData: FormData | Record<string, unknown>
): Promise<ActionResult<ProjectFile>> {
  const raw = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData
  const parsed = CreateFileSchema.safeParse(raw)
  if (!parsed.success) return validationError(parsed.error.issues)

  const result = await createProjectFile(parsed.data)
  if (result.error) {
    console.error("actionCreateFile: DB error", result.error)
    return failure("Failed to create file")
  }
  return success(result.data!)
}

const UpdateFileSchema = z.object({
  path: z.string().min(1).max(500).optional(),
  language: z.string().min(1).max(50).optional(),
  content: z.string().optional(),
})

export async function actionUpdateFile(
  id: string,
  formData: FormData | Record<string, unknown>
): Promise<ActionResult<ProjectFile>> {
  if (!id) return failure("File ID is required")
  const raw = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData
  const parsed = UpdateFileSchema.safeParse(raw)
  if (!parsed.success) return validationError(parsed.error.issues)

  const result = await updateProjectFile(id, parsed.data)
  if (result.error) {
    console.error("actionUpdateFile: DB error", result.error)
    return failure("Failed to update file")
  }
  return success(result.data!)
}

export async function actionDeleteFile(id: string): Promise<ActionResult> {
  if (!id) return failure("File ID is required")
  const result = await deleteProjectFile(id)
  if (result.error) {
    console.error("actionDeleteFile: DB error", result.error)
    return failure("Failed to delete file")
  }
  return success(undefined)
}

// ─────────────────────────────────────────────
//  Deployment actions
// ─────────────────────────────────────────────

const CreateDeploymentSchema = z.object({
  projectId: z.string().min(1),
  status: z.enum(["queued", "building", "success", "failed", "cancelled"]).default("queued"),
  url: z.string().url().nullable().optional(),
  commitSha: z.string().max(40).nullable().optional(),
  commitMessage: z.string().max(500).nullable().optional(),
  buildLogs: z.string().nullable().optional(),
})

export async function actionCreateDeployment(
  formData: FormData | Record<string, unknown>
): Promise<ActionResult<Deployment>> {
  const raw = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData
  const parsed = CreateDeploymentSchema.safeParse(raw)
  if (!parsed.success) return validationError(parsed.error.issues)

  const result = await createDeployment({
    projectId: parsed.data.projectId,
    status: parsed.data.status,
    url: parsed.data.url ?? null,
    commitSha: parsed.data.commitSha ?? null,
    commitMessage: parsed.data.commitMessage ?? null,
    buildLogs: parsed.data.buildLogs ?? null,
  })
  if (result.error) {
    console.error("actionCreateDeployment: DB error", result.error)
    return failure("Failed to create deployment")
  }
  return success(result.data!)
}

const UpdateDeploymentSchema = z.object({
  status: z.enum(["queued", "building", "success", "failed", "cancelled"]).optional(),
  url: z.string().url().nullable().optional(),
  buildLogs: z.string().nullable().optional(),
})

export async function actionUpdateDeployment(
  id: string,
  formData: FormData | Record<string, unknown>
): Promise<ActionResult<Deployment>> {
  if (!id) return failure("Deployment ID is required")
  const raw = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData
  const parsed = UpdateDeploymentSchema.safeParse(raw)
  if (!parsed.success) return validationError(parsed.error.issues)

  const result = await updateDeployment(id, parsed.data)
  if (result.error) {
    console.error("actionUpdateDeployment: DB error", result.error)
    return failure("Failed to update deployment")
  }
  return success(result.data!)
}

// ─────────────────────────────────────────────
//  Message (chat) actions
// ─────────────────────────────────────────────

const CreateMessageSchema = z.object({
  projectId: z.string().min(1),
  threadId: z.string().min(1),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1),
  agentId: z.string().nullable().optional(),
  modelId: z.string().nullable().optional(),
  codeBlocks: z
    .array(
      z.object({
        language: z.string(),
        code: z.string(),
        filename: z.string().nullable().optional(),
      })
    )
    .optional(),
})

export async function actionCreateMessage(
  input: Record<string, unknown>
): Promise<ActionResult<Message>> {
  const parsed = CreateMessageSchema.safeParse(input)
  if (!parsed.success) return validationError(parsed.error.issues)

  const result = await createMessage({
    projectId: parsed.data.projectId,
    threadId: parsed.data.threadId,
    role: parsed.data.role,
    content: parsed.data.content,
    agentId: parsed.data.agentId ?? null,
    modelId: parsed.data.modelId ?? null,
    codeBlocks: (parsed.data.codeBlocks ?? []).map(cb => ({
      language: cb.language,
      code: cb.code,
      filename: cb.filename ?? null,
    })),
  })
  if (result.error) {
    console.error("actionCreateMessage: DB error", result.error)
    return failure("Failed to save message")
  }
  return success(result.data!)
}
