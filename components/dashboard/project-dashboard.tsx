"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import {
  Zap, Plus, Rocket, GitBranch, Globe, Download, Check,
  Clock, Archive, Layers, ChevronRight, ExternalLink,
  GitPullRequest, CircleCheck, Circle, Sparkles, X,
  Monitor, Apple, Terminal, Star, LayoutDashboard,
  Folder, Activity, Users, ArrowUpRight, RefreshCw,
  GitMerge, AlertCircle, Package,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { type Project, type Deployment } from "@/lib/db"
import {
  actionCreateProject,
  actionDeleteProject,
  actionUpdateProject,
} from "@/lib/actions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"

// ─────────────────────────────────────────────
//  Types & constants
// ─────────────────────────────────────────────

const TEMPLATES = [
  { id: "nextjs", label: "Next.js App", icon: "⚡", desc: "Full-stack React framework with App Router" },
  { id: "api", label: "API Service", icon: "🔌", desc: "REST or GraphQL API with Next.js routes" },
  { id: "landing", label: "Landing Page", icon: "🎨", desc: "Marketing site with animations" },
  { id: "saas", label: "SaaS Starter", icon: "🚀", desc: "Auth, billing, and dashboard boilerplate" },
]

const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    color: "text-muted-foreground",
    borderColor: "border-border",
    badgeColor: "bg-muted text-muted-foreground",
    features: [
      "1 active project",
      "Basic repository integration",
      "Limited deployment usage",
      "Community support",
    ],
    cta: "Current plan",
    ctaDisabled: true,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    color: "text-primary",
    borderColor: "border-primary/40",
    badgeColor: "bg-primary/15 text-primary",
    features: [
      "Unlimited projects",
      "Full GitHub automation",
      "Advanced deployment workflows",
      "Priority build queue",
      "Full dashboard features",
      "Desktop application downloads",
    ],
    cta: "Upgrade to Pro",
    ctaDisabled: false,
    highlight: true,
  },
]

const MOCK_PRS = [
  {
    id: "pr-1",
    number: 42,
    title: "feat: add AI-powered autocomplete",
    repo: "my-forge-app",
    status: "open" as const,
    author: "dev",
    checks: "passing" as const,
    updatedAt: "2h ago",
  },
  {
    id: "pr-2",
    number: 41,
    title: "fix: resolve hydration mismatch in layout",
    repo: "my-forge-app",
    status: "merged" as const,
    author: "dev",
    checks: "passing" as const,
    updatedAt: "1d ago",
  },
  {
    id: "pr-3",
    number: 7,
    title: "chore: update dependencies to latest",
    repo: "api-service",
    status: "open" as const,
    author: "dev",
    checks: "failing" as const,
    updatedAt: "3h ago",
  },
]

const DESKTOP_APP_VERSION = "1.0.0"

const DESKTOP_DOWNLOADS = [
  { os: "macOS", icon: Apple, ext: "dmg", arch: "Apple Silicon + Intel", href: "#" },
  { os: "Windows", icon: Monitor, ext: "exe", arch: "64-bit", href: "#" },
  { os: "Linux", icon: Terminal, ext: "AppImage", arch: "x86_64", href: "#" },
]

// ─────────────────────────────────────────────
//  Helper: status badge
// ─────────────────────────────────────────────

function StatusBadge({ status }: { status: Project["status"] }) {
  if (status === "active")
    return (
      <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
        <span className="w-1 h-1 rounded-full bg-primary" />
        Active
      </span>
    )
  if (status === "draft")
    return (
      <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium">
        <Circle className="size-2" />
        Draft
      </span>
    )
  return (
    <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
      <Archive className="size-2" />
      Archived
    </span>
  )
}

function DeployBadge({ status }: { status: Deployment["status"] }) {
  const map: Record<Deployment["status"], { label: string; className: string }> = {
    success:  { label: "Deployed",  className: "bg-primary/15 text-primary" },
    building: { label: "Building",  className: "bg-amber-500/15 text-amber-400" },
    queued:   { label: "Queued",    className: "bg-muted text-muted-foreground" },
    failed:   { label: "Failed",    className: "bg-destructive/15 text-destructive" },
    cancelled:{ label: "Cancelled", className: "bg-muted text-muted-foreground" },
  }
  const { label, className } = map[status]
  return (
    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", className)}>
      {label}
    </span>
  )
}

// ─────────────────────────────────────────────
//  New Project Dialog
// ─────────────────────────────────────────────

function NewProjectDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (project: Project) => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [template, setTemplate] = useState("nextjs")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await actionCreateProject({
        ownerId: "user-1",
        name: name.trim(),
        description: description.trim() || null,
        template,
        status: "active",
      })
      if (!result.success || !result.data) {
        setError(result.error ?? "Failed to create project")
        return
      }
      onCreate(result.data)
      setName("")
      setDescription("")
      setTemplate("nextjs")
      onClose()
    } catch {
      setError("Failed to create project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            New Project
          </DialogTitle>
          <DialogDescription>
            Create a new FORGES project. A GitHub repository will be generated automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Project name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="my-awesome-app"
              className="w-full bg-secondary/50 rounded-lg px-3 py-2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Description <span className="text-muted-foreground">(optional)</span></label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What does this project do?"
              className="w-full bg-secondary/50 rounded-lg px-3 py-2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Template</label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-lg border text-left transition-colors",
                    template === t.id
                      ? "border-primary/50 bg-primary/8 text-foreground"
                      : "border-border/50 hover:border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{t.icon}</span>
                    <span className="text-xs font-medium">{t.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground leading-tight">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
          {error && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <AlertCircle className="size-3" />{error}
            </p>
          )}
          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                loading || !name.trim()
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              )}
            >
              {loading ? <Spinner className="size-4" /> : <Sparkles className="size-4" />}
              {loading ? "Creating…" : "Create Project"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────
//  Project Card
// ─────────────────────────────────────────────

function ProjectCard({
  project,
  latestDeployment,
  onDelete,
  onArchive,
}: {
  project: Project
  latestDeployment?: Deployment
  onDelete: (id: string) => void
  onArchive: (id: string) => void
}) {
  const [deleting, setDeleting] = useState(false)
  const [archiving, setArchiving] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete project "${project.name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await actionDeleteProject(project.id)
      onDelete(project.id)
    } finally {
      setDeleting(false)
    }
  }

  const handleArchive = async () => {
    setArchiving(true)
    try {
      await actionUpdateProject(project.id, {
        status: project.status === "archived" ? "active" : "archived",
      })
      onArchive(project.id)
    } finally {
      setArchiving(false)
    }
  }

  const templateEmoji: Record<string, string> = {
    nextjs: "⚡", api: "🔌", landing: "🎨", saas: "🚀",
  }

  return (
    <div className="group relative flex flex-col bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all hover:shadow-[0_0_16px_oklch(0.72_0.18_200/0.06)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-base">
            {templateEmoji[project.template ?? "nextjs"] ?? "📦"}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">{project.name}</h3>
            {project.description && (
              <p className="text-[11px] text-muted-foreground truncate">{project.description}</p>
            )}
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><GitBranch className="size-3" />main</span>
        <span className="flex items-center gap-1"><Clock className="size-3" />{formatDate(project.updatedAt)}</span>
        {project.template && (
          <span className="flex items-center gap-1"><Layers className="size-3" />{project.template}</span>
        )}
      </div>

      {/* Deployment */}
      {latestDeployment && (
        <div className="flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded-lg bg-secondary/30 border border-border/40">
          <Rocket className="size-3 text-muted-foreground shrink-0" />
          <span className="text-[11px] text-muted-foreground truncate flex-1">
            {latestDeployment.url ?? "Pending deployment"}
          </span>
          <DeployBadge status={latestDeployment.status} />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5 mt-auto pt-1">
        <Link
          href="/ide"
          className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          <Zap className="size-3" />
          Open IDE
        </Link>
        {latestDeployment?.url && (
          <a
            href={latestDeployment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Open deployment"
          >
            <ExternalLink className="size-3.5" />
          </a>
        )}
        <button
          onClick={handleArchive}
          disabled={archiving}
          className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title={project.status === "archived" ? "Unarchive" : "Archive"}
        >
          <Archive className="size-3.5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
          title="Delete project"
        >
          {deleting ? <Spinner className="size-3.5" /> : <X className="size-3.5" />}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  Utility
// ─────────────────────────────────────────────

function formatDate(date: Date): string {
  const now = Date.now()
  const diff = now - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

// ─────────────────────────────────────────────
//  Main Dashboard
// ─────────────────────────────────────────────

export function ProjectDashboard({
  initialProjects,
  initialDeployments,
}: {
  initialProjects: Project[]
  initialDeployments: Deployment[]
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [deployments] = useState<Deployment[]>(initialDeployments)
  const [showNewProject, setShowNewProject] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [activeTab, setActiveTab] = useState<"projects" | "pulls" | "deployments">("projects")

  const handleCreate = useCallback((project: Project) => {
    setProjects(prev => [project, ...prev])
  }, [])

  const handleDelete = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  const handleArchive = useCallback((id: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: p.status === "archived" ? "active" : "archived" }
          : p
      )
    )
  }, [])

  const activeProjects = projects.filter(p => p.status === "active")
  const draftProjects = projects.filter(p => p.status === "draft")

  return (
    <div className="h-dvh bg-background overflow-y-auto">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 md:px-6 bg-panel-header border-b border-border backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_8px_oklch(0.72_0.18_200/0.4)]">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">FORGES</span>
          <div className="h-4 w-px bg-border mx-1 hidden sm:block" />
          <span className="text-sm font-medium text-muted-foreground hidden sm:block">Dashboard</span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          <span className="px-3 py-1.5 rounded-md bg-accent text-foreground text-xs font-medium flex items-center gap-1.5">
            <LayoutDashboard className="size-3.5" />Projects
          </span>
          <button
            onClick={() => setShowPricing(true)}
            className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-1.5"
          >
            <Star className="size-3.5" />Pricing
          </button>
          <a
            href="#downloads"
            className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-1.5"
          >
            <Download className="size-3.5" />Download
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/ide"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Zap className="size-3.5" />Open IDE
          </Link>
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">New Project</span>
          </button>
          <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
            <span className="text-[11px] font-semibold text-primary">D</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* ── Stats ── */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Projects", value: projects.length, icon: Folder, color: "text-primary" },
              { label: "Active", value: activeProjects.length, icon: Activity, color: "text-primary" },
              { label: "Deployments", value: deployments.length, icon: Rocket, color: "text-amber-400" },
              { label: "Collaborators", value: 1, icon: Users, color: "text-violet-400" },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-2 bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <stat.icon className={cn("size-3.5", stat.color)} />
                </div>
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tabs ── */}
        <section>
          <div className="flex items-center gap-1 border-b border-border mb-6">
            {([
              { id: "projects", label: "Projects", icon: Folder, count: projects.length },
              { id: "pulls", label: "Pull Requests", icon: GitPullRequest, count: MOCK_PRS.filter(p => p.status === "open").length },
              { id: "deployments", label: "Deployments", icon: Rocket, count: deployments.length },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 text-sm border-b-2 transition-colors -mb-px",
                  activeTab === tab.id
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="size-3.5" />
                {tab.label}
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                  activeTab === tab.id ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {activeProjects.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Activity className="size-4 text-primary" />
                      Active Projects
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">{activeProjects.length}</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeProjects.map(p => (
                      <ProjectCard
                        key={p.id}
                        project={p}
                        latestDeployment={deployments.find(d => d.projectId === p.id)}
                        onDelete={handleDelete}
                        onArchive={handleArchive}
                      />
                    ))}
                    {/* New project card */}
                    <button
                      onClick={() => setShowNewProject(true)}
                      className="flex flex-col items-center justify-center gap-2 bg-card border border-dashed border-border rounded-xl p-8 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all min-h-[160px]"
                    >
                      <Plus className="size-6" />
                      <span className="text-sm font-medium">New Project</span>
                    </button>
                  </div>
                </div>
              )}

              {draftProjects.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Circle className="size-4 text-amber-400" />
                    Drafts
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium">{draftProjects.length}</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {draftProjects.map(p => (
                      <ProjectCard
                        key={p.id}
                        project={p}
                        latestDeployment={deployments.find(d => d.projectId === p.id)}
                        onDelete={handleDelete}
                        onArchive={handleArchive}
                      />
                    ))}
                  </div>
                </div>
              )}

              {projects.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Folder className="size-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-base font-semibold text-foreground mb-1">No projects yet</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Create your first project to get started with FORGES.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewProject(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Sparkles className="size-4" />
                    Create your first project
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pull Requests Tab */}
          {activeTab === "pulls" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Pull request workflow — changes flow from feature branches through review to production.
                </p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <RefreshCw className="size-3.5" />Sync
                </button>
              </div>
              {MOCK_PRS.map(pr => (
                <div key={pr.id} className="flex items-start gap-3 px-4 py-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                  <div className={cn(
                    "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                    pr.status === "open" ? "bg-primary/15" : "bg-violet-500/15"
                  )}>
                    {pr.status === "merged"
                      ? <GitMerge className="size-3 text-violet-400" />
                      : <GitPullRequest className="size-3 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{pr.title}</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                        pr.status === "open" ? "bg-primary/15 text-primary" : "bg-violet-500/15 text-violet-400"
                      )}>
                        {pr.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                      <span>#{pr.number}</span>
                      <span>{pr.repo}</span>
                      <span className="flex items-center gap-1">
                        {pr.checks === "passing"
                          ? <><CircleCheck className="size-3 text-primary" />checks passing</>
                          : <><AlertCircle className="size-3 text-destructive" />checks failing</>}
                      </span>
                      <span>{pr.updatedAt}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0">
                    Review <ChevronRight className="size-3" />
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-center pt-4">
                <Link href="/ide" className="flex items-center gap-1.5 text-xs text-primary hover:opacity-80 transition-opacity">
                  Open IDE to create a pull request <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Deployments Tab */}
          {activeTab === "deployments" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  All deployments are powered by Vercel with automatic previews on every pull request.
                </p>
              </div>
              {deployments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Rocket className="size-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No deployments yet. Open a project in the IDE to deploy.</p>
                </div>
              ) : (
                deployments.map(d => (
                  <div key={d.id} className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                    <div className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      d.status === "success" ? "bg-primary" :
                      d.status === "building" ? "bg-amber-400 animate-pulse" :
                      d.status === "failed" ? "bg-destructive" : "bg-muted-foreground"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground truncate">
                          {d.commitMessage ?? "Deployment"}
                        </span>
                        <DeployBadge status={d.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
                        {d.commitSha && <span className="font-mono">{d.commitSha.slice(0, 7)}</span>}
                        {d.url && <span className="truncate">{d.url}</span>}
                        <span>{formatDate(d.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {d.url && (
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* ── Pricing ── */}
        <section id="pricing">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Star className="size-4 text-primary" />
              Pricing
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {PRICING_PLANS.map(plan => (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col bg-card border rounded-xl p-6",
                  plan.borderColor,
                  plan.highlight && "shadow-[0_0_24px_oklch(0.72_0.18_200/0.1)]"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <h3 className={cn("text-base font-bold", plan.color)}>{plan.name}</h3>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", plan.badgeColor)}>
                    {plan.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/ {plan.period}</span>
                </div>
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className={cn("size-3.5 shrink-0", plan.color)} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={plan.ctaDisabled}
                  className={cn(
                    "w-full py-2 rounded-lg text-sm font-medium transition-all",
                    plan.ctaDisabled
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Desktop Download ── */}
        <section id="downloads">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Package className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Desktop Application</h2>
                  <p className="text-xs text-muted-foreground">Get the full FORGES experience on your machine</p>
                </div>
              </div>
              <div className="sm:ml-auto flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium">Pro required</span>
                <span className="text-xs text-muted-foreground">v{DESKTOP_APP_VERSION}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DESKTOP_DOWNLOADS.map(dl => (
                <a
                  key={dl.os}
                  href={dl.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                  <dl.icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{dl.os}</p>
                    <p className="text-[11px] text-muted-foreground">{dl.arch} · .{dl.ext}</p>
                  </div>
                  <Download className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-8 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center">
              <Zap className="size-3 text-primary-foreground" />
            </div>
            <span>FORGES © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Build fast · Ship fast · Collaborate openly</span>
          </div>
        </footer>
      </main>

      {/* ── New Project Dialog ── */}
      <NewProjectDialog
        open={showNewProject}
        onClose={() => setShowNewProject(false)}
        onCreate={handleCreate}
      />

      {/* ── Pricing Dialog ── */}
      <Dialog open={showPricing} onOpenChange={v => !v && setShowPricing(false)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="size-4 text-primary" />
              FORGES Pricing
            </DialogTitle>
            <DialogDescription>
              Choose the plan that fits your workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {PRICING_PLANS.map(plan => (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col bg-secondary/30 border rounded-xl p-5",
                  plan.borderColor
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className={cn("text-sm font-bold mb-1", plan.color)}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-xs text-muted-foreground">/ {plan.period}</span>
                </div>
                <ul className="flex flex-col gap-1.5 mb-5 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className={cn("size-3 shrink-0", plan.color)} />{f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={plan.ctaDisabled}
                  onClick={() => setShowPricing(false)}
                  className={cn(
                    "w-full py-2 rounded-lg text-xs font-medium transition-all",
                    plan.ctaDisabled
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
