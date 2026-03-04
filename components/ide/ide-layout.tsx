"use client"

import { useState, useCallback, useEffect } from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { IdeHeader } from "./ide-header"
import { ActivityBar } from "./activity-bar"
import { ChatPanel } from "./chat-panel"
import { FileExplorer } from "./file-explorer"
import { CodeEditor } from "./code-editor"
import { PreviewPanel } from "./preview-panel"
import { MobileNav, type MobileTab } from "./mobile-nav"
import { CopilotOverlay } from "./copilot-overlay"
import { SmartBuilder } from "./smart-builder"
import { cn } from "@/lib/utils"
import {
  Search,
  GitBranch,
  Bug,
  Blocks,
  Settings,
  FolderTree,
  Database,
  Shield,
  Globe,
  Terminal,
  Sparkles,
} from "lucide-react"

type SidebarView = "chat" | "files" | "search" | "git" | "debug" | "extensions"

export function IdeLayout() {
  const [activeFile, setActiveFile] = useState("page.tsx")
  const [sidebarView, setSidebarView] = useState<SidebarView>("chat")
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat")
  const [showSidebar, setShowSidebar] = useState(true)
  const [showCopilot, setShowCopilot] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)

  // Global keyboard shortcut for Copilot
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setShowCopilot((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const handleActivityChange = useCallback(
    (item: SidebarView) => {
      if (item === sidebarView && showSidebar) {
        setShowSidebar(false)
      } else {
        setSidebarView(item)
        setShowSidebar(true)
      }
    },
    [sidebarView, showSidebar]
  )

  const handleMobileTabChange = useCallback((tab: MobileTab) => {
    setMobileTab(tab)
  }, [])

  const handleCopilotSubmit = useCallback((prompt: string) => {
    // Switch to chat and trigger a message
    setSidebarView("chat")
    setShowSidebar(true)
    setMobileTab("chat")
  }, [])

  const handleBuild = useCallback(
    (config: { template: string; database: string | null; features: string[]; style: string }) => {
      // Simulate build: switch to chat to show progress
      setSidebarView("chat")
      setShowSidebar(true)
      setMobileTab("chat")
    },
    []
  )

  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden bg-background">
      <IdeHeader
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onOpenCopilot={() => setShowCopilot(true)}
        onOpenBuilder={() => setShowBuilder(true)}
      />

      {/* Desktop layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <ActivityBar
          activeItem={sidebarView}
          onItemChange={handleActivityChange}
        />

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar panel */}
          {showSidebar && (
            <>
              <ResizablePanel defaultSize={22} minSize={15} maxSize={40}>
                <div className="h-full overflow-hidden">
                  {sidebarView === "chat" && <ChatPanel />}
                  {sidebarView === "files" && (
                    <FileExplorer
                      activeFile={activeFile}
                      onSelectFile={setActiveFile}
                    />
                  )}
                  {sidebarView === "search" && <SearchPanel />}
                  {sidebarView === "git" && <GitPanel />}
                  {sidebarView === "debug" && <DebugPanel />}
                  {sidebarView === "extensions" && <ExtensionsPanel />}
                </div>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Code editor */}
          <ResizablePanel
            defaultSize={showSidebar ? 43 : 55}
            minSize={25}
          >
            <CodeEditor activeFile={activeFile} onFileChange={setActiveFile} />
          </ResizablePanel>

          <ResizableHandle />

          {/* Preview */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <PreviewPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-1 overflow-hidden">
        <div className={cn("w-full h-full", mobileTab !== "chat" && "hidden")}>
          <ChatPanel />
        </div>
        <div className={cn("w-full h-full", mobileTab !== "files" && "hidden")}>
          <FileExplorer
            activeFile={activeFile}
            onSelectFile={(file) => {
              setActiveFile(file)
              setMobileTab("editor")
            }}
          />
        </div>
        <div
          className={cn("w-full h-full", mobileTab !== "editor" && "hidden")}
        >
          <CodeEditor activeFile={activeFile} onFileChange={setActiveFile} />
        </div>
        <div
          className={cn("w-full h-full", mobileTab !== "preview" && "hidden")}
        >
          <PreviewPanel />
        </div>
      </div>

      <MobileNav activeTab={mobileTab} onTabChange={handleMobileTabChange} />

      {/* Overlays */}
      <CopilotOverlay
        open={showCopilot}
        onClose={() => setShowCopilot(false)}
        onSubmit={handleCopilotSubmit}
      />
      <SmartBuilder
        open={showBuilder}
        onClose={() => setShowBuilder(false)}
        onBuild={handleBuild}
      />
    </div>
  )
}

/* Sidebar panels */
function SearchPanel() {
  const [query, setQuery] = useState("")
  const results = query.trim()
    ? [
        { file: "page.tsx", line: 5, text: `<CardTitle className="text-2xl font-bold text-center">` },
        { file: "layout.tsx", line: 8, text: `title: "My App",` },
        { file: "button.tsx", line: 12, text: `"inline-flex items-center justify-center rounded-md text-sm"` },
      ]
    : []

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Search
        </span>
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-2.5 py-2 border border-border/50 focus-within:border-primary/40 transition-colors">
          <Search className="size-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across files..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </div>
      {results.length > 0 ? (
        <div className="flex-1 overflow-y-auto px-2">
          <p className="text-[10px] text-muted-foreground px-1 mb-1.5">
            {results.length} results in {new Set(results.map((r) => r.file)).size} files
          </p>
          {results.map((r, i) => (
            <button
              key={i}
              className="flex flex-col gap-0.5 w-full px-2.5 py-2 rounded-lg hover:bg-accent/50 transition-colors text-left"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground">{r.file}</span>
                <span className="text-[9px] text-muted-foreground">:{r.line}</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono truncate">
                {r.text}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-3">
          <p className="text-xs text-muted-foreground">
            Type to search across all files in your project.
          </p>
        </div>
      )}
    </div>
  )
}

function GitPanel() {
  const changes = [
    { file: "page.tsx", status: "modified" },
    { file: "globals.css", status: "modified" },
    { file: "route.ts", status: "added" },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Source Control
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
          {changes.length}
        </span>
      </div>
      <div className="px-2 py-2">
        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-2.5 py-2 border border-border/50 mb-2">
          <input
            type="text"
            placeholder="Commit message..."
            className="bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
        <button className="w-full px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity mb-3">
          Commit & Push
        </button>
      </div>
      <div className="px-2 flex-1">
        <p className="text-[10px] text-muted-foreground px-1 mb-1.5 uppercase font-semibold tracking-wider">
          Changes
        </p>
        {changes.map((c) => (
          <div
            key={c.file}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-accent/40 transition-colors"
          >
            <span className="text-xs text-foreground">{c.file}</span>
            <span
              className={cn(
                "text-[9px] px-1.5 py-0.5 rounded font-medium",
                c.status === "modified"
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-primary/15 text-primary"
              )}
            >
              {c.status[0].toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DebugPanel() {
  const logs = [
    { type: "info", text: "App started on port 3000", time: "12:01" },
    { type: "warn", text: "Missing NEXT_PUBLIC_API_URL env var", time: "12:01" },
    { type: "info", text: "Compiled successfully in 1.2s", time: "12:02" },
    { type: "info", text: "GET / 200 in 45ms", time: "12:03" },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Console
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            <Terminal className="size-3" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 font-mono">
        {logs.map((log, i) => (
          <div
            key={i}
            className="flex items-start gap-2 px-2 py-1 text-[11px] hover:bg-accent/20 rounded transition-colors"
          >
            <span className="text-muted-foreground/50 shrink-0">{log.time}</span>
            <span
              className={cn(
                log.type === "warn"
                  ? "text-amber-400"
                  : log.type === "error"
                  ? "text-red-400"
                  : "text-foreground/80"
              )}
            >
              {log.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExtensionsPanel() {
  const extensions = [
    {
      name: "AI Copilot",
      desc: "Inline code suggestions powered by AI",
      installed: true,
      color: "#22c55e",
    },
    {
      name: "Tailwind CSS IntelliSense",
      desc: "Autocomplete for Tailwind classes",
      installed: true,
      color: "#38bdf8",
    },
    {
      name: "ESLint",
      desc: "JavaScript linter for code quality",
      installed: true,
      color: "#4b32c3",
    },
    {
      name: "Prettier",
      desc: "Opinionated code formatter",
      installed: true,
      color: "#f7b93e",
    },
    {
      name: "GitHub Copilot",
      desc: "AI pair programmer",
      installed: false,
      color: "#ffffff",
    },
    {
      name: "Prisma",
      desc: "Database toolkit and ORM",
      installed: false,
      color: "#5a67d8",
    },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Extensions
        </span>
      </div>
      <div className="px-2 py-2">
        <div className="flex items-center gap-1.5 bg-secondary/50 rounded-lg px-2.5 py-2 border border-border/50 mb-2">
          <Search className="size-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search extensions..."
            className="bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        <p className="text-[10px] text-muted-foreground px-1 mb-1 uppercase font-semibold tracking-wider">
          Installed
        </p>
        {extensions
          .filter((e) => e.installed)
          .map((ext) => (
            <div
              key={ext.name}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-accent/40 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                style={{
                  backgroundColor: ext.color + "18",
                  color: ext.color,
                }}
              >
                {ext.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">
                  {ext.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {ext.desc}
                </p>
              </div>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium shrink-0">
                ON
              </span>
            </div>
          ))}
        <p className="text-[10px] text-muted-foreground px-1 mb-1 mt-3 uppercase font-semibold tracking-wider">
          Recommended
        </p>
        {extensions
          .filter((e) => !e.installed)
          .map((ext) => (
            <div
              key={ext.name}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-accent/40 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                style={{
                  backgroundColor: ext.color + "18",
                  color: ext.color,
                }}
              >
                {ext.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">
                  {ext.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {ext.desc}
                </p>
              </div>
              <button className="text-[9px] px-2 py-1 rounded-md border border-border text-foreground hover:bg-accent transition-colors shrink-0">
                Install
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}
