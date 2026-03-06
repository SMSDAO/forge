"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Zap,
  Play,
  ChevronDown,
  Settings,
  GitBranch,
  Rocket,
  Search,
  Menu,
  Sparkles,
  Layers,
  Command,
  Globe,
  Share2,
  Cloud,
  Check,
  Copy,
  ExternalLink,
  Monitor,
  X,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getRoleLabel, getRoleColor, type UserRole } from "@/lib/rbac"

const DEFAULT_ROLE: UserRole = "developer"

export function IdeHeader({
  onToggleSidebar,
  onOpenCopilot,
  onOpenBuilder,
  projectName = "my-forge-app",
  userRole = DEFAULT_ROLE,
}: {
  onToggleSidebar?: () => void
  onOpenCopilot?: () => void
  onOpenBuilder?: () => void
  projectName?: string
  userRole?: UserRole
}) {
  const [showProjectMenu, setShowProjectMenu] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [isRunning, setIsRunning] = useState(true)
  const [isDeploying, setIsDeploying] = useState(false)

  const handleDeploy = () => {
    setIsDeploying(true)
    setTimeout(() => setIsDeploying(false), 2500)
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText("https://my-forge-app.vercel.app")
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const roleColor = getRoleColor(userRole)

  return (
    <header className="flex items-center justify-between h-11 px-2 md:px-3 bg-panel-header border-b border-border shrink-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-4" />
        </button>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_8px_oklch(0.72_0.18_200/0.4)]">
            <Zap className="size-3.5 text-primary-foreground" />
          </div>
          <span className="text-xs font-bold text-foreground hidden sm:block">Forge</span>
        </div>
        <div className="h-4 w-px bg-border mx-0.5 hidden sm:block" />

        {/* Project selector */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowProjectMenu(!showProjectMenu)}
            className="flex items-center gap-1 px-1.5 py-1 rounded-md hover:bg-accent transition-colors"
          >
            <Cloud className="size-3 text-primary" />
            <span className="text-xs text-foreground font-medium truncate max-w-[100px] md:max-w-[160px]">{projectName}</span>
            <ChevronDown className={cn("size-3 text-muted-foreground transition-transform", showProjectMenu && "rotate-180")} />
          </button>
          {showProjectMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProjectMenu(false)} />
              <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="p-1.5">
                  <button
                    onClick={() => setShowProjectMenu(false)}
                    className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md bg-primary/8 text-foreground text-xs text-left"
                  >
                    <Cloud className="size-3.5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{projectName}</p>
                      <p className="text-[9px] text-muted-foreground">Cloud workspace - Active</p>
                    </div>
                    <Check className="size-3.5 text-primary shrink-0" />
                  </button>
                  <button className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md hover:bg-accent text-muted-foreground text-xs text-left mt-0.5">
                    <Monitor className="size-3.5" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">portfolio-site</p>
                      <p className="text-[9px]">Last opened 2 days ago</p>
                    </div>
                  </button>
                </div>
                <div className="border-t border-border p-1.5">
                  <button className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md hover:bg-accent text-xs text-muted-foreground">
                    <Sparkles className="size-3.5" />
                    New project
                  </button>
                  <button className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md hover:bg-accent text-xs text-muted-foreground">
                    <Globe className="size-3.5" />
                    Import from GitHub
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center - Copilot + Builder */}
      <div className="hidden md:flex items-center gap-1">
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border/50"
        >
          <Command className="size-3" />
          <span>Copilot</span>
          <kbd className="ml-0.5 px-1 py-0.5 rounded bg-secondary/60 border border-border text-[9px] text-muted-foreground">
            {'Ctrl+K'}
          </kbd>
        </button>
        <button
          onClick={onOpenBuilder}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors border border-primary/20 bg-primary/5"
        >
          <Layers className="size-3 text-primary" />
          <span className="text-primary font-medium">Smart Builder</span>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-0.5">
        <button className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <GitBranch className="size-3" />
          <span>main</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        {/* Run button */}
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={cn(
            "flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all",
            isRunning ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-secondary text-foreground hover:bg-accent"
          )}
        >
          {isRunning ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
              <span className="hidden sm:inline">Running</span>
            </>
          ) : (
            <>
              <Play className="size-3" />
              <span className="hidden sm:inline">Run</span>
            </>
          )}
        </button>

        {/* Deploy button */}
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className={cn(
            "hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-md border text-xs font-medium transition-all",
            isDeploying
              ? "border-primary/30 text-primary bg-primary/5 cursor-wait"
              : "border-border text-foreground hover:bg-accent"
          )}
        >
          {isDeploying ? (
            <>
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span>Deploying</span>
            </>
          ) : (
            <>
              <Rocket className="size-3" />
              <span>Deploy</span>
            </>
          )}
        </button>

        {/* Share */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Share"
          >
            <Share2 className="size-3.5" />
          </button>
          {showShareMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
              <div className="absolute top-full right-0 mt-1 w-64 bg-card border border-border rounded-lg shadow-xl z-50 p-3">
                <p className="text-xs font-medium text-foreground mb-2">Share project</p>
                <div className="flex items-center gap-1.5 bg-secondary/50 rounded-lg px-2.5 py-2 border border-border/50 mb-2">
                  <Globe className="size-3 text-muted-foreground shrink-0" />
                  <span className="text-[11px] text-muted-foreground font-mono truncate flex-1">my-forge-app.vercel.app</span>
                  <button onClick={handleCopyUrl} className="shrink-0">
                    {copiedUrl ? <Check className="size-3 text-primary" /> : <Copy className="size-3 text-muted-foreground hover:text-foreground" />}
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                    <ExternalLink className="size-3" />
                    Open
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md border border-border text-xs text-foreground hover:bg-accent transition-colors">
                    <Copy className="size-3" />
                    Clone
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile shortcuts */}
        <button
          onClick={onOpenBuilder}
          className="flex md:hidden items-center p-1.5 rounded-md text-primary hover:bg-accent transition-colors"
          aria-label="Smart Builder"
        >
          <Layers className="size-4" />
        </button>
        <button
          onClick={onOpenCopilot}
          className="flex md:hidden items-center p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Copilot"
        >
          <Sparkles className="size-4" />
        </button>

        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Project Dashboard"
        >
          <LayoutDashboard className="size-3.5" />
          <span className="hidden md:inline">Dashboard</span>
        </Link>
        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Settings">
          <Settings className="size-3.5" />
        </button>

        {/* User avatar with RBAC role indicator */}
        <div className="relative ml-0.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors"
            style={{
              backgroundColor: `color-mix(in srgb, ${roleColor} 13%, transparent)`,
              border: `1px solid color-mix(in srgb, ${roleColor} 31%, transparent)`,
            }}
            title={getRoleLabel(userRole)}
          >
            <span className="text-[10px] font-semibold" style={{ color: roleColor }}>
              {getRoleLabel(userRole)[0]}
            </span>
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-panel-header"
            style={{ backgroundColor: roleColor }}
          />
        </div>
      </div>
    </header>
  )
}
