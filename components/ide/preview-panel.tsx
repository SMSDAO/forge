"use client"

import { useState, useEffect } from "react"
import {
  Globe,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  ArrowLeft,
  ArrowRight,
  Lock,
  Wifi,
  Minimize2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { actionListDeployments } from "@/lib/actions"
import type { Deployment } from "@/lib/db"

type ViewportSize = "mobile" | "tablet" | "desktop"

const VIEWPORTS: Record<ViewportSize, { width: string; icon: React.ReactNode; label: string }> = {
  mobile: { width: "375px", icon: <Smartphone className="size-3.5" />, label: "Mobile" },
  tablet: { width: "768px", icon: <Tablet className="size-3.5" />, label: "Tablet" },
  desktop: { width: "100%", icon: <Monitor className="size-3.5" />, label: "Desktop" },
}

const DEPLOY_STATUS_COLORS: Record<Deployment["status"], string> = {
  success: "bg-primary",
  building: "bg-amber-400",
  queued: "bg-muted-foreground",
  failed: "bg-destructive",
  cancelled: "bg-muted-foreground",
}

export function PreviewPanel({ projectId = "proj-1" }: { projectId?: string }) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [url, setUrl] = useState("localhost:3000")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [latestDeployment, setLatestDeployment] = useState<Deployment | null>(null)

  // Load latest deployment for current project
  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    actionListDeployments(projectId).then(result => {
      if (!cancelled && result.data.length > 0) {
        setLatestDeployment(result.data[0])
        if (result.data[0].url) setUrl(result.data[0].url.replace(/^https?:\/\//, ""))
      }
    }).catch(() => {})
    return () => { cancelled = true }
  }, [projectId])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  return (
    <div className={cn(
      "ide-panel bg-background",
      isFullscreen && "fixed inset-0 z-[90]"
    )}>
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-2 h-11 border-b border-border bg-panel-header shrink-0">
        {/* Navigation */}
        <div className="flex items-center gap-0.5 shrink-0">
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
        <div className="flex-1 flex items-center gap-1.5 bg-secondary/60 rounded-lg px-2.5 py-1.5 border border-border/50 min-w-0 focus-within:border-primary/40 transition-colors">
          <Lock className="size-3 text-primary shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-foreground font-mono w-full min-w-0"
            aria-label="URL"
          />
          <Wifi className="size-3 text-primary/60 shrink-0" />
        </div>

        {/* Viewport toggle - hidden on small screens */}
        <div className="hidden lg:flex items-center gap-0.5 bg-secondary/40 rounded-lg p-0.5 shrink-0">
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
              title={VIEWPORTS[key].label}
            >
              {VIEWPORTS[key].icon}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Open in new tab"
            title="Open in new tab"
          >
            <ExternalLink className="size-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Preview content */}
      <div className="ide-panel-scroll flex items-start justify-center bg-secondary/20">
        <div
          className={cn(
            "h-full bg-background overflow-hidden transition-all duration-300",
            viewport === "desktop" ? "w-full" : "border-x border-border shadow-2xl",
            viewport !== "desktop" && "mx-auto mt-0 md:mt-4 md:rounded-t-lg"
          )}
          style={{
            width: viewport === "desktop" ? "100%" : VIEWPORTS[viewport].width,
            maxWidth: "100%",
          }}
        >
          {/* Simulated preview content */}
          <div className="w-full h-full flex flex-col overflow-y-auto">
            {/* App header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-xs sm:text-sm">F</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-foreground">Forge App</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-7 sm:h-8 w-16 sm:w-20 rounded-md bg-secondary/60" />
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-secondary/60" />
              </div>
            </div>

            {/* App content */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
              <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-lg">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground text-center mb-2 text-balance">
                    Welcome to Forge IDE
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center mb-4 sm:mb-6 text-pretty">
                    Start building your next project with AI assistance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                      Get Started
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-accent transition-colors">
                      Documentation
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
                  {[
                    { label: "Components", count: "12" },
                    { label: "API Routes", count: "4" },
                    { label: "Pages", count: "6" },
                    { label: "Utils", count: "8" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-card border border-border rounded-lg p-2.5 sm:p-3">
                      <p className="text-base sm:text-lg font-bold text-foreground">{stat.count}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview status */}
      <div className="flex items-center justify-between px-3 h-7 bg-primary/8 border-t border-border text-[10px] shrink-0">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              latestDeployment
                ? DEPLOY_STATUS_COLORS[latestDeployment.status]
                : "bg-primary animate-pulse"
            )} />
            {latestDeployment ? latestDeployment.status : "Live"}
          </span>
          <span className="hidden sm:inline font-mono">{url}</span>
        </div>
        <span className="text-muted-foreground">
          {VIEWPORTS[viewport].label}
          <span className="hidden sm:inline"> ({VIEWPORTS[viewport].width === "100%" ? "Full" : VIEWPORTS[viewport].width})</span>
        </span>
      </div>
    </div>
  )
}
