"use client"

import { useState, useCallback, useEffect } from "react"
import {
  ResizablePanelGroup, ResizablePanel, ResizableHandle,
} from "@/components/ui/resizable"
import { IdeHeader } from "./ide-header"
import { ActivityBar } from "./activity-bar"
import { ChatPanel } from "./chat-panel"
import { FileExplorer } from "./file-explorer"
import { CodeEditor, FILE_CONTENTS, type VFSFile } from "./code-editor"
import { PreviewPanel } from "./preview-panel"
import { MobileNav, type MobileTab } from "./mobile-nav"
import { CopilotOverlay } from "./copilot-overlay"
import { SmartBuilder } from "./smart-builder"
import { cn } from "@/lib/utils"
import {
  Search, GitBranch, Terminal, Blocks, Database, Shield, Globe,
  Sparkles, X, Check, FolderTree, Settings, Filter, Bug,
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import {
  actionListProjects,
  actionListFiles,
  actionListDeployments,
  actionListMessages,
} from "@/lib/actions"

type SidebarView = "chat" | "files" | "search" | "git" | "debug" | "extensions" | "database"

export function IdeLayout() {
  // ═══════ Shared VFS state ═══════
  const [vfs, setVfs] = useState<Record<string, VFSFile>>(() => ({ ...FILE_CONTENTS }))
  const [activeFile, setActiveFile] = useState("page.tsx")
  const [sidebarView, setSidebarView] = useState<SidebarView>("chat")
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat")
  const [showSidebar, setShowSidebar] = useState(true)
  const [showCopilot, setShowCopilot] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setShowCopilot(prev => !prev)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  // VFS operations
  const handleVfsUpdate = useCallback((name: string, content: string) => {
    setVfs(prev => ({ ...prev, [name]: { ...prev[name], content } }))
  }, [])

  const handleNewFile = useCallback((name: string) => {
    const ext = name.split(".").pop() ?? "ts"
    const langMap: Record<string, string> = { tsx: "tsx", ts: "ts", jsx: "jsx", js: "js", css: "css", json: "json", md: "md" }
    setVfs(prev => ({ ...prev, [name]: { language: langMap[ext] ?? "ts", content: `// ${name}\n` } }))
  }, [])

  const handleDeleteFile = useCallback((name: string) => {
    setVfs(prev => { const next = { ...prev }; delete next[name]; return next })
    if (activeFile === name) {
      const remaining = Object.keys(vfs).filter(k => k !== name)
      setActiveFile(remaining[0] ?? "page.tsx")
    }
  }, [activeFile, vfs])

  const handleActivityChange = useCallback((item: SidebarView) => {
    if (item === sidebarView && showSidebar) setShowSidebar(false)
    else { setSidebarView(item); setShowSidebar(true) }
  }, [sidebarView, showSidebar])

  const handleMobileTabChange = useCallback((tab: MobileTab) => setMobileTab(tab), [])

  const handleCopilotSubmit = useCallback((prompt: string) => {
    setSidebarView("chat"); setShowSidebar(true); setMobileTab("chat")
  }, [])

  const handleBuild = useCallback((config: { template: string; database: string | null; features: string[]; style: string }) => {
    setSidebarView("chat"); setShowSidebar(true); setMobileTab("chat")
  }, [])

  const renderSidebarContent = () => {
    switch (sidebarView) {
      case "chat": return <ChatPanel />
      case "files": return <FileExplorer activeFile={activeFile} onSelectFile={setActiveFile} vfs={vfs} onNewFile={handleNewFile} onDeleteFile={handleDeleteFile} />
      case "search": return <SearchPanel />
      case "git": return <GitPanel />
      case "debug": return <DebugPanel />
      case "extensions": return <ExtensionsPanel />
      case "database": return <DatabasePanel />
      default: return <ChatPanel />
    }
  }

  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden bg-background">
      <IdeHeader
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onOpenCopilot={() => setShowCopilot(true)}
        onOpenBuilder={() => setShowBuilder(true)}
      />

      {/* ═══════ Desktop ═══════ */}
      <div className="hidden md:flex flex-1 min-h-0 overflow-hidden">
        <ActivityBar activeItem={sidebarView} onItemChange={handleActivityChange} />
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {showSidebar && (
            <>
              <ResizablePanel defaultSize={22} minSize={15} maxSize={40}>
                <div className="h-full overflow-hidden">{renderSidebarContent()}</div>
              </ResizablePanel>
              <ResizableHandle className="w-px bg-border hover:bg-primary/40 transition-colors data-[resize-handle-state=drag]:bg-primary/60" />
            </>
          )}
          <ResizablePanel defaultSize={showSidebar ? 43 : 55} minSize={25}>
            <CodeEditor activeFile={activeFile} onFileChange={setActiveFile} vfs={vfs} onVfsUpdate={handleVfsUpdate} />
          </ResizablePanel>
          <ResizableHandle className="w-px bg-border hover:bg-primary/40 transition-colors data-[resize-handle-state=drag]:bg-primary/60" />
          <ResizablePanel defaultSize={35} minSize={20}>
            <PreviewPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* ═══════ Mobile ═══════ */}
      <div className="flex md:hidden flex-1 min-h-0 overflow-hidden">
        <div className={cn("w-full h-full", mobileTab !== "chat" && "hidden")}><ChatPanel /></div>
        <div className={cn("w-full h-full", mobileTab !== "files" && "hidden")}>
          <FileExplorer activeFile={activeFile} onSelectFile={(f) => { setActiveFile(f); setMobileTab("editor") }} vfs={vfs} onNewFile={handleNewFile} onDeleteFile={handleDeleteFile} />
        </div>
        <div className={cn("w-full h-full", mobileTab !== "editor" && "hidden")}>
          <CodeEditor activeFile={activeFile} onFileChange={setActiveFile} vfs={vfs} onVfsUpdate={handleVfsUpdate} />
        </div>
        <div className={cn("w-full h-full", mobileTab !== "preview" && "hidden")}><PreviewPanel /></div>
        <div className={cn("w-full h-full", mobileTab !== "terminal" && "hidden")}><CloudTerminalPanel /></div>
        <div className={cn("w-full h-full", mobileTab !== "database" && "hidden")}><DatabasePanel /></div>
      </div>

      <MobileNav activeTab={mobileTab} onTabChange={handleMobileTabChange} />
      <CopilotOverlay open={showCopilot} onClose={() => setShowCopilot(false)} onSubmit={handleCopilotSubmit} />
      <SmartBuilder open={showBuilder} onClose={() => setShowBuilder(false)} onBuild={handleBuild} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Search Panel
═══════════════════════════════════════════════════════════ */
function SearchPanel() {
  const [query, setQuery] = useState("")
  const [replaceQuery, setReplaceQuery] = useState("")
  const [showReplace, setShowReplace] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [regex, setRegex] = useState(false)

  const results = query.trim() ? [
    { file: "app/page.tsx", line: 5, text: `<CardTitle className="text-2xl font-bold text-center">` },
    { file: "app/layout.tsx", line: 8, text: `title: "My App",` },
    { file: "components/ui/button.tsx", line: 12, text: `"inline-flex items-center justify-center rounded-md"` },
    { file: "lib/utils.ts", line: 3, text: `export function cn(...inputs: ClassValue[]) {` },
  ] : []

  const groups = results.reduce<Record<string, typeof results>>((a, r) => { (a[r.file] ??= []).push(r); return a }, {})

  return (
    <div className="ide-panel bg-background">
      <div className="flex items-center justify-between px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search</span>
        <button onClick={() => setShowReplace(!showReplace)} className={cn("p-1 rounded text-muted-foreground hover:text-foreground transition-colors", showReplace && "text-primary")} aria-label="Toggle replace">
          <Filter className="size-3" />
        </button>
      </div>
      <div className="px-3 pt-2.5 pb-1 flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center gap-1.5 bg-secondary/50 rounded-lg px-2.5 py-2 border border-border/50 focus-within:border-primary/40 transition-colors">
          <Search className="size-3.5 text-muted-foreground shrink-0" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search across files..." className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full" />
          <div className="flex items-center gap-0.5 shrink-0">
            <button onClick={() => setCaseSensitive(!caseSensitive)} className={cn("px-1 py-0.5 rounded text-[9px] font-mono font-bold transition-colors", caseSensitive ? "text-primary bg-primary/10" : "text-muted-foreground/50 hover:text-muted-foreground")}>Aa</button>
            <button onClick={() => setRegex(!regex)} className={cn("px-1 py-0.5 rounded text-[9px] font-mono font-bold transition-colors", regex ? "text-primary bg-primary/10" : "text-muted-foreground/50 hover:text-muted-foreground")}>.*</button>
          </div>
        </div>
        {showReplace && (
          <div className="flex items-center gap-1.5 bg-secondary/50 rounded-lg px-2.5 py-2 border border-border/50 focus-within:border-primary/40 transition-colors">
            <input type="text" value={replaceQuery} onChange={e => setReplaceQuery(e.target.value)} placeholder="Replace with..." className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full" />
            <button className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium shrink-0">All</button>
          </div>
        )}
      </div>
      <div className="ide-panel-scroll px-2 pb-2">
        {results.length > 0 ? (
          <>
            <p className="text-[10px] text-muted-foreground px-1 mb-1.5 py-1">{results.length} results in {Object.keys(groups).length} files</p>
            {Object.entries(groups).map(([file, matches]) => (
              <div key={file} className="mb-1">
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-foreground">
                  <FolderTree className="size-3 text-primary shrink-0" />
                  <span className="truncate">{file}</span>
                  <span className="text-muted-foreground/50 ml-auto shrink-0">{matches.length}</span>
                </div>
                {matches.map((r, i) => (
                  <button key={i} className="flex items-start gap-2 w-full px-2.5 py-1.5 ml-2 rounded-md hover:bg-accent/50 transition-colors text-left">
                    <span className="text-[10px] text-editor-gutter font-mono shrink-0 pt-0.5 min-w-[2.5ch] text-right">{r.line}</span>
                    <span className="text-[11px] text-muted-foreground font-mono truncate leading-relaxed">{r.text}</span>
                  </button>
                ))}
              </div>
            ))}
          </>
        ) : query.trim() ? (
          <div className="flex items-center justify-center px-4 py-8"><p className="text-xs text-muted-foreground">No results for &quot;{query}&quot;</p></div>
        ) : (
          <div className="px-1 pt-1"><p className="text-xs text-muted-foreground">Type to search across all project files.</p></div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Git Panel
═══════════════════════════════════════════════════════════ */
function GitPanel() {
  const [commitMsg, setCommitMsg] = useState("")
  const [staged, setStaged] = useState<string[]>(["route.ts"])
  const changes = [
    { file: "app/page.tsx", status: "modified" as const, add: 12, del: 3 },
    { file: "app/globals.css", status: "modified" as const, add: 8, del: 2 },
    { file: "app/api/chat/route.ts", status: "added" as const, add: 24, del: 0 },
    { file: "lib/db.ts", status: "added" as const, add: 18, del: 0 },
  ]

  return (
    <div className="ide-panel bg-background">
      <div className="flex items-center justify-between px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source Control</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">{changes.length}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 shrink-0">
        <GitBranch className="size-3.5 text-primary" />
        <span className="text-xs text-foreground font-medium">main</span>
        <span className="text-[10px] text-muted-foreground ml-auto">synced</span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      </div>
      <div className="px-3 py-2 border-b border-border/50 shrink-0">
        <textarea value={commitMsg} onChange={e => setCommitMsg(e.target.value)} placeholder="Commit message..." rows={2} className="w-full bg-secondary/50 rounded-lg px-2.5 py-2 border border-border/50 text-xs text-foreground placeholder:text-muted-foreground resize-none outline-none focus:border-primary/40 transition-colors" />
        <div className="flex items-center gap-1.5 mt-1.5">
          <button disabled={!commitMsg.trim()} className={cn("flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all", commitMsg.trim() ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed")}>
            Commit ({staged.length})
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors">Push</button>
        </div>
      </div>
      <div className="ide-panel-scroll px-2 py-1.5">
        <p className="text-[10px] text-muted-foreground px-1 mb-1 uppercase font-semibold tracking-wider">Changes ({changes.length})</p>
        {changes.map(c => (
          <button key={c.file} onClick={() => setStaged(prev => prev.includes(c.file) ? prev.filter(f => f !== c.file) : [...prev, c.file])} className={cn("flex items-center gap-2 w-full px-2.5 py-2 rounded-lg transition-colors text-left group", staged.includes(c.file) ? "bg-primary/5" : "hover:bg-accent/40")}>
            <div className={cn("w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors", staged.includes(c.file) ? "bg-primary border-primary" : "border-muted-foreground/30")}>
              {staged.includes(c.file) && <Check className="size-2 text-primary-foreground" />}
            </div>
            <span className="text-xs text-foreground flex-1 truncate">{c.file}</span>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[9px] text-primary font-mono">+{c.add}</span>
              {c.del > 0 && <span className="text-[9px] text-destructive font-mono">-{c.del}</span>}
            </div>
            <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0", c.status === "modified" ? "bg-amber-500/15 text-amber-400" : "bg-primary/15 text-primary")}>
              {c.status === "modified" ? "M" : "A"}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Debug / Console Panel
═══════════════════════════════════════════════════════════ */
function DebugPanel() {
  const [filter, setFilter] = useState<"all" | "info" | "warn" | "error">("all")
  const logs = [
    { type: "info" as const, text: "Forge IDE v3.0 Cloud Engine started", time: "12:01:03" },
    { type: "info" as const, text: "Next.js 16.1.6 - Turbopack enabled", time: "12:01:03" },
    { type: "info" as const, text: "Local: http://localhost:3000", time: "12:01:04" },
    { type: "warn" as const, text: "Missing NEXT_PUBLIC_API_URL environment variable", time: "12:01:04" },
    { type: "info" as const, text: "Compiled client and server in 1.2s", time: "12:01:05" },
    { type: "info" as const, text: "GET / 200 in 45ms", time: "12:03:11" },
    { type: "error" as const, text: "TypeError: Cannot read properties of undefined (reading 'map')", time: "12:05:01" },
    { type: "info" as const, text: "Hot reload triggered - page.tsx", time: "12:05:04" },
    { type: "info" as const, text: "GET / 200 in 38ms", time: "12:05:05" },
  ]
  const filtered = filter === "all" ? logs : logs.filter(l => l.type === filter)

  return (
    <div className="ide-panel bg-background">
      <div className="flex items-center justify-between px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Console</span>
        <div className="flex items-center gap-0.5">
          {(["all", "info", "warn", "error"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn("px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors", filter === f ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {f === "all" ? "All" : f === "warn" ? "Warn" : f === "error" ? "Err" : "Info"}
            </button>
          ))}
        </div>
      </div>
      <div className="ide-panel-scroll p-1.5 font-mono">
        {filtered.map((log, i) => (
          <div key={i} className={cn("flex items-start gap-2 px-2 py-1 text-[11px] rounded transition-colors hover:bg-accent/20", log.type === "error" && "bg-destructive/5")}>
            <span className="text-muted-foreground/40 shrink-0 min-w-[60px]">{log.time}</span>
            <span className={cn("text-[9px] font-semibold px-1 py-0.5 rounded shrink-0 min-w-[28px] text-center uppercase", log.type === "warn" ? "text-amber-400 bg-amber-500/10" : log.type === "error" ? "text-red-400 bg-red-500/10" : "text-muted-foreground/60")}>{log.type === "info" ? "" : log.type}</span>
            <span className={cn("break-all leading-relaxed", log.type === "warn" ? "text-amber-400" : log.type === "error" ? "text-red-400" : "text-foreground/80")}>{log.text}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-2 py-1.5 border-t border-border shrink-0">
        <span className="text-primary/70 text-xs font-mono shrink-0">{'>'}</span>
        <input type="text" placeholder="Evaluate expression..." className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-foreground placeholder:text-muted-foreground" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Database Panel
═══════════════════════════════════════════════════════════ */
function DatabasePanel() {
  const [activeDb, setActiveDb] = useState("supabase")
  const [activeTab, setActiveTab] = useState<"tables" | "query" | "migrations">("tables")
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM users LIMIT 10;")

  // Real record counts from DB
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [countsLoading, setCountsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const ownerId = "user-1"
    const projectId = "proj-1"
    Promise.all([
      actionListProjects(ownerId),
      actionListFiles(projectId),
      actionListDeployments(projectId),
      actionListMessages(projectId),
    ]).then(([projects, files, deployments, messages]) => {
      if (cancelled) return
      setCounts({
        users: 1,
        projects: projects.data.length,
        messages: messages.data.length,
        files: files.data.length,
        deployments: deployments.data.length,
      })
      setCountsLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const databases = [
    { id: "supabase", name: "Supabase", color: "#3ecf8e", status: "connected" },
    { id: "redis", name: "Upstash Redis", color: "#dc382d", status: "connected" },
  ]
  const tables = [
    { name: "users", rows: counts.users ?? 0, columns: ["id", "email", "name", "avatar_url", "created_at"] },
    { name: "projects", rows: counts.projects ?? 0, columns: ["id", "name", "owner_id", "status", "created_at"] },
    { name: "messages", rows: counts.messages ?? 0, columns: ["id", "project_id", "thread_id", "content", "role", "created_at"] },
    { name: "files", rows: counts.files ?? 0, columns: ["id", "project_id", "path", "content", "language"] },
    { name: "deployments", rows: counts.deployments ?? 0, columns: ["id", "project_id", "status", "url", "created_at"] },
  ]
  const migrations = [
    { id: "001", name: "create_users_table", status: "applied", date: "2026-02-15" },
    { id: "002", name: "create_projects_table", status: "applied", date: "2026-02-16" },
    { id: "003", name: "add_messages_table", status: "applied", date: "2026-02-20" },
    { id: "004", name: "add_files_and_deployments", status: "applied", date: "2026-03-04" },
  ]

  return (
    <div className="ide-panel bg-background">
      <div className="flex items-center justify-between px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Database</span>
        <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="Database settings"><Settings className="size-3" /></button>
      </div>
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border/50 tab-row shrink-0">
        {databases.map(db => (
          <button key={db.id} onClick={() => setActiveDb(db.id)} className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors shrink-0", activeDb === db.id ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50")}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: db.color }} />{db.name}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-0.5 px-2 py-1 border-b border-border/50 shrink-0">
        {(["tables", "query", "migrations"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={cn("px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors", activeTab === tab ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}>{tab}</button>
        ))}
      </div>
      <div className="ide-panel-scroll">
        {activeTab === "tables" && (
          <div className="p-2">
            {countsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="size-5 text-muted-foreground" />
              </div>
            ) : tables.map(table => (
              <details key={table.name} className="group mb-1">
                <summary className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-accent/40 transition-colors list-none">
                  <Database className="size-3.5 text-primary shrink-0" />
                  <span className="text-xs font-medium text-foreground flex-1">{table.name}</span>
                  <span className="text-[9px] text-muted-foreground">{table.rows} rows</span>
                </summary>
                <div className="ml-4 pl-4 border-l border-border/50 py-1">
                  {table.columns.map(col => (
                    <div key={col} className="flex items-center gap-2 px-2 py-0.5 text-[11px]">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30 shrink-0" />
                      <span className="text-muted-foreground font-mono">{col}</span>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
        {activeTab === "query" && (
          <div className="p-2 flex flex-col gap-2">
            <textarea value={sqlQuery} onChange={e => setSqlQuery(e.target.value)} rows={4} className="w-full bg-editor-bg rounded-lg px-3 py-2 border border-border/50 text-xs font-mono text-foreground placeholder:text-muted-foreground resize-none outline-none focus:border-primary/40 transition-colors" placeholder="SELECT * FROM ..." />
            <button className="self-end px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <Terminal className="size-3" />Run Query
            </button>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-secondary/30 px-3 py-1.5 border-b border-border text-[10px] text-muted-foreground font-medium">Results (3 rows, 12ms)</div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead><tr className="border-b border-border/50"><th className="px-3 py-1.5 text-left font-medium text-muted-foreground">id</th><th className="px-3 py-1.5 text-left font-medium text-muted-foreground">email</th><th className="px-3 py-1.5 text-left font-medium text-muted-foreground">name</th></tr></thead>
                  <tbody className="font-mono">
                    <tr className="border-b border-border/30 hover:bg-accent/20"><td className="px-3 py-1.5 text-syntax-number">1</td><td className="px-3 py-1.5 text-syntax-string">alice@example.com</td><td className="px-3 py-1.5 text-foreground">Alice</td></tr>
                    <tr className="border-b border-border/30 hover:bg-accent/20"><td className="px-3 py-1.5 text-syntax-number">2</td><td className="px-3 py-1.5 text-syntax-string">bob@example.com</td><td className="px-3 py-1.5 text-foreground">Bob</td></tr>
                    <tr className="hover:bg-accent/20"><td className="px-3 py-1.5 text-syntax-number">3</td><td className="px-3 py-1.5 text-syntax-string">carol@example.com</td><td className="px-3 py-1.5 text-foreground">Carol</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {activeTab === "migrations" && (
          <div className="p-2">
            {migrations.map(m => (
              <div key={m.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-accent/40 transition-colors">
                <div className={cn("w-5 h-5 rounded flex items-center justify-center shrink-0", m.status === "applied" ? "bg-primary/15 text-primary" : "bg-amber-500/15 text-amber-400")}>
                  {m.status === "applied" ? <Check className="size-3" /> : <span className="text-[9px] font-bold">!</span>}
                </div>
                <div className="flex-1 min-w-0"><p className="text-xs font-medium text-foreground truncate">{m.name}</p><p className="text-[9px] text-muted-foreground">{m.date}</p></div>
                <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0", m.status === "applied" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-400")}>{m.status}</span>
              </div>
            ))}
            <button className="w-full mt-2 px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">+ Create Migration</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Cloud Terminal Panel (mobile standalone)
═══════════════════════════════════════════════════════════ */
export function CloudTerminalPanel() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState([
    { t: "sys", v: "Forge Cloud Terminal v3.0" },
    { t: "sys", v: "Connected to cloud workspace: us-east-1" },
    { t: "sys", v: "Node.js 20.11 | pnpm 9.1 | Git 2.43" },
    { t: "sys", v: "---" },
    { t: "cmd", v: "pnpm dev" },
    { t: "out", v: "  Next.js 16.1.6 (turbopack)" },
    { t: "out", v: "  Local: http://localhost:3000" },
    { t: "ok",  v: "  Ready in 847ms" },
  ])

  const handleCmd = () => {
    if (!input.trim()) return
    const cmd = input.trim()
    if (cmd === "clear") { setHistory([{ t: "sys", v: "Forge Cloud Terminal v3.0" }]); setInput(""); return }
    const responses: Record<string, string[]> = {
      "ls": ["app/  components/  lib/  package.json  tsconfig.json"], "pwd": ["/home/forge/my-forge-app"],
      "node -v": ["v20.11.0"], "pnpm -v": ["9.1.0"], "git status": ["On branch main", "nothing to commit"],
    }
    const out = responses[cmd]
    setHistory(prev => [...prev, { t: "cmd", v: cmd }, ...(out ? out.map(v => ({ t: "out", v })) : [{ t: "out", v: `$ ${cmd}` }, { t: "ok", v: "Done." }])])
    setInput("")
  }

  return (
    <div className="ide-panel bg-background">
      <div className="flex items-center justify-between px-3 h-10 border-b border-border shrink-0">
        <div className="flex items-center gap-2"><Terminal className="size-3.5 text-primary" /><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Terminal</span></div>
        <span className="flex items-center gap-1 text-[9px] text-primary/70"><span className="w-1.5 h-1.5 rounded-full bg-primary" style={{ animation: "pulse-dot 2s infinite" }} />Cloud</span>
      </div>
      <div className="ide-panel-scroll p-2 font-mono text-xs">
        {history.map((e, i) => (
          <div key={i} className={cn("leading-relaxed", e.t === "cmd" && "mt-1")}>
            {e.t === "cmd" ? <span><span className="text-primary">$</span> <span className="text-foreground">{e.v}</span></span>
              : e.t === "ok" ? <span className="text-primary/80">{e.v}</span>
              : e.t === "sys" ? <span className="text-muted-foreground/60">{e.v}</span>
              : <span className="text-muted-foreground">{e.v}</span>}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 border-t border-border shrink-0">
        <span className="text-primary text-xs font-mono shrink-0">$</span>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleCmd() }} placeholder="Enter command..." className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-foreground placeholder:text-muted-foreground" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Extensions Panel
═══════════════════════════════════════════════════════════ */
function ExtensionsPanel() {
  const [installStates, setInstallStates] = useState<Record<string, "idle" | "installing" | "installed">>({})
  const extensions = [
    { name: "AI Copilot", desc: "Inline code suggestions powered by AI", installed: true, color: "#22c55e", version: "3.2.1" },
    { name: "Tailwind IntelliSense", desc: "Autocomplete for Tailwind classes", installed: true, color: "#38bdf8", version: "4.0.0" },
    { name: "ESLint", desc: "JavaScript linter for code quality", installed: true, color: "#4b32c3", version: "9.5.0" },
    { name: "Prettier", desc: "Opinionated code formatter", installed: true, color: "#f7b93e", version: "3.4.0" },
    { name: "GitHub Copilot", desc: "AI pair programmer", installed: false, color: "#e8e8e8", version: "1.8" },
    { name: "Prisma ORM", desc: "Database toolkit and type-safe ORM", installed: false, color: "#5a67d8", version: "6.2" },
    { name: "Docker", desc: "Container management", installed: false, color: "#2496ed", version: "2.1" },
  ]

  const handleInstall = (name: string) => {
    setInstallStates(prev => ({ ...prev, [name]: "installing" }))
    setTimeout(() => setInstallStates(prev => ({ ...prev, [name]: "installed" })), 1500)
  }

  return (
    <div className="ide-panel bg-background">
      <div className="flex items-center px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Extensions</span>
      </div>
      <div className="px-2 py-2 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-1.5 bg-secondary/50 rounded-lg px-2.5 py-2 border border-border/50 focus-within:border-primary/40 transition-colors">
          <Search className="size-3 text-muted-foreground" />
          <input type="text" placeholder="Search extensions..." className="bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground w-full" />
        </div>
      </div>
      <div className="ide-panel-scroll px-2 pb-2">
        <p className="text-[10px] text-muted-foreground px-1 mb-1 mt-2 uppercase font-semibold tracking-wider">Installed</p>
        {extensions.filter(e => e.installed).map(ext => (
          <div key={ext.name} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-accent/40 transition-colors">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold" style={{ backgroundColor: ext.color + "18", color: ext.color }}>{ext.name[0]}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5"><p className="text-xs font-medium text-foreground truncate">{ext.name}</p><span className="text-[9px] text-muted-foreground">v{ext.version}</span></div>
              <p className="text-[10px] text-muted-foreground truncate">{ext.desc}</p>
            </div>
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium shrink-0">ON</span>
          </div>
        ))}
        <p className="text-[10px] text-muted-foreground px-1 mb-1 mt-3 uppercase font-semibold tracking-wider">Recommended</p>
        {extensions.filter(e => !e.installed).map(ext => {
          const state = installStates[ext.name] ?? "idle"
          return (
            <div key={ext.name} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-accent/40 transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold" style={{ backgroundColor: ext.color + "18", color: ext.color }}>{ext.name[0]}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5"><p className="text-xs font-medium text-foreground truncate">{ext.name}</p><span className="text-[9px] text-muted-foreground">v{ext.version}</span></div>
                <p className="text-[10px] text-muted-foreground truncate">{ext.desc}</p>
              </div>
              {state === "installed" ? <span className="text-[8px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium shrink-0">ON</span>
                : state === "installing" ? <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0" />
                : <button onClick={() => handleInstall(ext.name)} className="text-[9px] px-2 py-1 rounded-md border border-border text-foreground hover:bg-accent transition-colors shrink-0">Install</button>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
