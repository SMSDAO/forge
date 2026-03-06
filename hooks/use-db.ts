"use client"

import { useState, useEffect, useCallback } from "react"
import {
  actionListProjects,
  actionGetProject,
  actionListFiles,
  actionListDeployments,
  actionListMessages,
  actionCreateMessage,
  actionCreateFile,
  actionUpdateFile,
  actionDeleteFile,
  type ActionListResult,
  type ActionResult,
} from "@/lib/actions"
import type { Project, ProjectFile, Deployment, Message } from "@/lib/db"

// ─────────────────────────────────────────────
//  useProjects
// ─────────────────────────────────────────────

export interface UseProjectsState {
  projects: Project[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProjects(ownerId: string): UseProjectsState {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!ownerId) return
    setLoading(true)
    setError(null)
    const result: ActionListResult<Project> = await actionListProjects(ownerId)
    setProjects(result.data)
    setError(result.error)
    setLoading(false)
  }, [ownerId])

  useEffect(() => { void fetch() }, [fetch])

  return { projects, loading, error, refetch: fetch }
}

// ─────────────────────────────────────────────
//  useProject
// ─────────────────────────────────────────────

export interface UseProjectState {
  project: Project | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProject(id: string): UseProjectState {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    const result: ActionResult<Project> = await actionGetProject(id)
    setProject(result.data)
    setError(result.error)
    setLoading(false)
  }, [id])

  useEffect(() => { void fetch() }, [fetch])

  return { project, loading, error, refetch: fetch }
}

// ─────────────────────────────────────────────
//  useProjectFiles
// ─────────────────────────────────────────────

export interface UseProjectFilesState {
  files: ProjectFile[]
  loading: boolean
  error: string | null
  refetch: () => void
  createFile: (path: string, language: string, content?: string) => Promise<ProjectFile | null>
  updateFile: (id: string, content: string) => Promise<ProjectFile | null>
  deleteFile: (id: string) => Promise<boolean>
}

export function useProjectFiles(projectId: string): UseProjectFilesState {
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    setError(null)
    const result: ActionListResult<ProjectFile> = await actionListFiles(projectId)
    setFiles(result.data)
    setError(result.error)
    setLoading(false)
  }, [projectId])

  useEffect(() => { void fetch() }, [fetch])

  const createFile = useCallback(async (path: string, language: string, content = ""): Promise<ProjectFile | null> => {
    const result = await actionCreateFile({ projectId, path, language, content })
    if (result.success && result.data) {
      setFiles(prev => [...prev, result.data!].sort((a, b) => a.path.localeCompare(b.path)))
      return result.data
    }
    return null
  }, [projectId])

  const updateFile = useCallback(async (id: string, content: string): Promise<ProjectFile | null> => {
    const result = await actionUpdateFile(id, { content })
    if (result.success && result.data) {
      setFiles(prev => prev.map(f => f.id === id ? result.data! : f))
      return result.data
    }
    return null
  }, [])

  const deleteFile = useCallback(async (id: string): Promise<boolean> => {
    const result = await actionDeleteFile(id)
    if (result.success) {
      setFiles(prev => prev.filter(f => f.id !== id))
      return true
    }
    return false
  }, [])

  return { files, loading, error, refetch: fetch, createFile, updateFile, deleteFile }
}

// ─────────────────────────────────────────────
//  useDeployments
// ─────────────────────────────────────────────

export interface UseDeploymentsState {
  deployments: Deployment[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDeployments(projectId: string): UseDeploymentsState {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    setError(null)
    const result: ActionListResult<Deployment> = await actionListDeployments(projectId)
    setDeployments(result.data)
    setError(result.error)
    setLoading(false)
  }, [projectId])

  useEffect(() => { void fetch() }, [fetch])

  return { deployments, loading, error, refetch: fetch }
}

// ─────────────────────────────────────────────
//  useMessages
// ─────────────────────────────────────────────

export interface UseMessagesState {
  messages: Message[]
  loading: boolean
  error: string | null
  sendMessage: (
    threadId: string,
    role: "user" | "assistant" | "system",
    content: string,
    opts?: { agentId?: string; modelId?: string }
  ) => Promise<Message | null>
}

export function useMessages(projectId: string, threadId?: string): UseMessagesState {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    actionListMessages(projectId, threadId).then(result => {
      if (!cancelled) {
        setMessages(result.data)
        setError(result.error)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [projectId, threadId])

  const sendMessage = useCallback(async (
    tid: string,
    role: "user" | "assistant" | "system",
    content: string,
    opts?: { agentId?: string; modelId?: string }
  ): Promise<Message | null> => {
    const result = await actionCreateMessage({
      projectId,
      threadId: tid,
      role,
      content,
      agentId: opts?.agentId ?? null,
      modelId: opts?.modelId ?? null,
      codeBlocks: [],
    })
    if (result.success && result.data) {
      setMessages(prev => [...prev, result.data!])
      return result.data
    }
    return null
  }, [projectId])

  return { messages, loading, error, sendMessage }
}
