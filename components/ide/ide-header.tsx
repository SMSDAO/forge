"use client"

import {
  Zap,
  Play,
  Share2,
  ChevronDown,
  Settings,
  GitBranch,
  Cloud,
  Rocket,
  Search,
  Bell,
  PanelLeft,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function IdeHeader({
  onToggleSidebar,
  projectName = "my-forge-app",
}: {
  onToggleSidebar?: () => void
  projectName?: string
}) {
  return (
    <header className="flex items-center justify-between h-12 px-2 md:px-4 bg-panel-header border-b border-border shrink-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground hidden sm:block">Forge</span>
        </div>
        <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
        <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-accent transition-colors hidden sm:flex">
          <span className="text-sm text-foreground font-medium truncate max-w-[120px] md:max-w-[200px]">
            {projectName}
          </span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
      </div>

      {/* Center - Actions */}
      <div className="hidden md:flex items-center gap-1">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Search className="size-3.5" />
          <span>Search</span>
          <kbd className="ml-1 px-1.5 py-0.5 rounded bg-secondary/60 border border-border text-[10px] text-muted-foreground">
            /
          </kbd>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <GitBranch className="size-3.5" />
          <span>main</span>
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
          <Play className="size-3.5" />
          <span className="hidden sm:inline">Run</span>
        </button>
        <button className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-xs text-foreground hover:bg-accent transition-colors">
          <Rocket className="size-3.5" />
          <span>Deploy</span>
        </button>
        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Notifications">
          <Bell className="size-4" />
        </button>
        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Settings">
          <Settings className="size-4" />
        </button>
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center ml-1">
          <span className="text-xs font-semibold text-primary">U</span>
        </div>
      </div>
    </header>
  )
}
