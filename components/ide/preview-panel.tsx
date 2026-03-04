"use client"

import { useState } from "react"
import {
  Globe,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  X,
  ArrowLeft,
  ArrowRight,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ViewportSize = "mobile" | "tablet" | "desktop"

const VIEWPORTS: Record<ViewportSize, { width: string; icon: React.ReactNode; label: string }> = {
  mobile: { width: "375px", icon: <Smartphone className="size-3.5" />, label: "Mobile" },
  tablet: { width: "768px", icon: <Tablet className="size-3.5" />, label: "Tablet" },
  desktop: { width: "100%", icon: <Monitor className="size-3.5" />, label: "Desktop" },
}

export function PreviewPanel() {
  const [viewport, setViewport] = useState<ViewportSize>("desktop")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [url, setUrl] = useState("localhost:3000")

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2 h-12 border-b border-border bg-panel-header shrink-0">
        {/* Navigation */}
        <div className="flex items-center gap-0.5">
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Go back">
            <ArrowLeft className="size-3.5" />
          </button>
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Go forward">
            <ArrowRight className="size-3.5" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Refresh preview"
          >
            <RefreshCw className={cn("size-3.5", isRefreshing && "animate-spin")} />
          </button>
        </div>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-1.5 bg-secondary/60 rounded-lg px-2.5 py-1.5 border border-border/50 min-w-0">
          <Lock className="size-3 text-primary shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-foreground font-mono w-full"
          />
          <Globe className="size-3 text-muted-foreground shrink-0" />
        </div>

        {/* Viewport toggle */}
        <div className="hidden md:flex items-center gap-0.5 bg-secondary/40 rounded-lg p-0.5">
          {(Object.keys(VIEWPORTS) as ViewportSize[]).map((key) => (
            <button
              key={key}
              onClick={() => setViewport(key)}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewport === key
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={`Switch to ${VIEWPORTS[key].label} view`}
            >
              {VIEWPORTS[key].icon}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Open in new tab">
            <ExternalLink className="size-3.5" />
          </button>
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Fullscreen">
            <Maximize2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Preview iframe area */}
      <div className="flex-1 flex items-start justify-center bg-secondary/20 p-0 md:p-4 overflow-auto">
        <div
          className={cn(
            "h-full bg-background border border-border rounded-none md:rounded-lg overflow-hidden transition-all duration-300 shadow-2xl",
            viewport === "desktop" && "w-full md:w-full",
          )}
          style={{
            width: viewport === "desktop" ? "100%" : VIEWPORTS[viewport].width,
            maxWidth: "100%",
          }}
        >
          {/* Simulated preview content */}
          <div className="w-full h-full flex flex-col">
            {/* Simulated app header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">F</span>
                </div>
                <span className="text-sm font-semibold text-foreground">Forge App</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-20 rounded-md bg-secondary/60" />
                <div className="h-8 w-8 rounded-full bg-secondary/60" />
              </div>
            </div>

            {/* Simulated content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-foreground text-center mb-2">
                    Welcome to Forge IDE
                  </h2>
                  <p className="text-sm text-muted-foreground text-center mb-6 text-pretty">
                    Start building your next project with AI assistance.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                      Get Started
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-accent transition-colors">
                      Documentation
                    </button>
                  </div>
                </div>

                {/* Additional preview elements */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {[
                    { label: "Components", count: "12" },
                    { label: "API Routes", count: "4" },
                    { label: "Pages", count: "6" },
                    { label: "Utils", count: "8" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-card border border-border rounded-lg p-3"
                    >
                      <p className="text-lg font-bold text-foreground">{stat.count}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview status */}
      <div className="flex items-center justify-between px-3 h-7 bg-primary/10 border-t border-border text-[11px] shrink-0">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live
          </span>
          <span>localhost:3000</span>
        </div>
        <span className="text-muted-foreground">
          {VIEWPORTS[viewport].label} ({VIEWPORTS[viewport].width === "100%" ? "Full" : VIEWPORTS[viewport].width})
        </span>
      </div>
    </div>
  )
}
