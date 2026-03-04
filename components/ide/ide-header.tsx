"use client"

import {
  Zap,
  Play,
  ChevronDown,
  Settings,
  GitBranch,
  Rocket,
  Search,
  Bell,
  Menu,
  Sparkles,
  Layers,
  Command,
  Moon,
  Sun,
  Globe,
  Share2,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function IdeHeader({
  onToggleSidebar,
  onOpenCopilot,
  onOpenBuilder,
  projectName = "my-forge-app",
}: {
  onToggleSidebar?: () => void
  onOpenCopilot?: () => void
  onOpenBuilder?: () => void
  projectName?: string
}) {
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
          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="size-3.5 text-primary-foreground" />
          </div>
          <span className="text-xs font-bold text-foreground hidden sm:block">Forge</span>
        </div>
        <div className="h-4 w-px bg-border mx-0.5 hidden sm:block" />
        <button className="flex items-center gap-1 px-1.5 py-1 rounded-md hover:bg-accent transition-colors hidden sm:flex">
          <span className="text-xs text-foreground font-medium truncate max-w-[100px] md:max-w-[160px]">
            {projectName}
          </span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
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
            Ctrl+K
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
        </button>
        <button className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
          <Play className="size-3" />
          <span className="hidden sm:inline">Run</span>
        </button>
        <button className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-md border border-border text-xs text-foreground hover:bg-accent transition-colors">
          <Rocket className="size-3" />
          <span>Deploy</span>
        </button>
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
        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors hidden sm:flex" aria-label="Share">
          <Share2 className="size-3.5" />
        </button>
        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Settings">
          <Settings className="size-3.5" />
        </button>
        <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center ml-0.5">
          <span className="text-[10px] font-semibold text-primary">U</span>
        </div>
      </div>
    </header>
  )
}
