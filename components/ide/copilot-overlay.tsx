"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Sparkles,
  X,
  ArrowRight,
  Lightbulb,
  Wand2,
  Bug,
  Palette,
  Rocket,
  Database,
  Shield,
  FileCode2,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickAction {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  category: "generate" | "fix" | "optimize" | "database"
  prompt: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "gen-component",
    label: "Generate Component",
    description: "Create a new React component from description",
    icon: <FileCode2 className="size-4" />,
    category: "generate",
    prompt: "Generate a React component for:",
  },
  {
    id: "gen-page",
    label: "Generate Page",
    description: "Scaffold a full page with layout",
    icon: <Wand2 className="size-4" />,
    category: "generate",
    prompt: "Generate a full page with:",
  },
  {
    id: "gen-api",
    label: "Generate API Route",
    description: "Create a REST API endpoint",
    icon: <Rocket className="size-4" />,
    category: "generate",
    prompt: "Create an API route for:",
  },
  {
    id: "fix-errors",
    label: "Fix Errors",
    description: "Auto-detect and fix code errors",
    icon: <Bug className="size-4" />,
    category: "fix",
    prompt: "Find and fix all errors in the current file",
  },
  {
    id: "fix-styles",
    label: "Fix Styles",
    description: "Improve responsive design and styling",
    icon: <Palette className="size-4" />,
    category: "fix",
    prompt: "Improve the styling and make it responsive",
  },
  {
    id: "optimize-perf",
    label: "Optimize Performance",
    description: "Improve loading speed and efficiency",
    icon: <Zap className="size-4" />,
    category: "optimize",
    prompt: "Optimize this code for better performance",
  },
  {
    id: "optimize-security",
    label: "Security Audit",
    description: "Check for vulnerabilities",
    icon: <Shield className="size-4" />,
    category: "optimize",
    prompt: "Audit this code for security vulnerabilities",
  },
  {
    id: "db-schema",
    label: "Generate Schema",
    description: "Design database schema from description",
    icon: <Database className="size-4" />,
    category: "database",
    prompt: "Design a database schema for:",
  },
]

export function CopilotOverlay({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (prompt: string) => void
}) {
  const [input, setInput] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, handleKeyDown])

  const handleAction = (action: QuickAction) => {
    if (action.prompt.endsWith(":")) {
      setInput(action.prompt + " ")
    } else {
      onSubmit(action.prompt)
      onClose()
    }
  }

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input.trim())
      setInput("")
      onClose()
    }
  }

  const filteredActions = selectedCategory
    ? QUICK_ACTIONS.filter((a) => a.category === selectedCategory)
    : QUICK_ACTIONS

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Command input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Sparkles className="size-5 text-primary shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit()
            }}
            placeholder="Ask Copilot anything... or pick an action below"
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          {input ? (
            <button
              onClick={handleSubmit}
              className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border/50 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0",
              !selectedCategory ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {[
            { id: "generate", label: "Generate", icon: <Wand2 className="size-3" /> },
            { id: "fix", label: "Fix", icon: <Bug className="size-3" /> },
            { id: "optimize", label: "Optimize", icon: <Zap className="size-3" /> },
            { id: "database", label: "Database", icon: <Database className="size-3" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0",
                selectedCategory === cat.id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick actions */}
        <div className="p-2 max-h-[280px] overflow-y-auto overscroll-contain">
          <div className="flex flex-col gap-0.5">
            {filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/60 transition-colors text-left w-full group"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                  {action.icon}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{action.description}</span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/20">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              Tip: Press <kbd className="px-1 py-0.5 rounded bg-secondary border border-border text-[9px] mx-0.5">Ctrl+K</kbd> anywhere to open Copilot
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
