"use client"

import { useState, useCallback } from "react"
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
import { cn } from "@/lib/utils"

type SidebarView = "chat" | "files" | "search" | "git" | "debug" | "extensions"

export function IdeLayout() {
  const [activeFile, setActiveFile] = useState("page.tsx")
  const [sidebarView, setSidebarView] = useState<SidebarView>("chat")
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat")
  const [showSidebar, setShowSidebar] = useState(true)

  const handleActivityChange = useCallback((item: SidebarView) => {
    if (item === sidebarView && showSidebar) {
      setShowSidebar(false)
    } else {
      setSidebarView(item)
      setShowSidebar(true)
    }
  }, [sidebarView, showSidebar])

  const handleMobileTabChange = useCallback((tab: MobileTab) => {
    setMobileTab(tab)
  }, [])

  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden bg-background">
      <IdeHeader
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
      />

      {/* Desktop layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <ActivityBar activeItem={sidebarView} onItemChange={handleActivityChange} />

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar panel (chat or files) */}
          {showSidebar && (
            <>
              <ResizablePanel defaultSize={22} minSize={15} maxSize={40}>
                <div className="h-full overflow-hidden">
                  {sidebarView === "chat" && <ChatPanel />}
                  {sidebarView === "files" && (
                    <FileExplorer activeFile={activeFile} onSelectFile={setActiveFile} />
                  )}
                  {sidebarView === "search" && (
                    <SearchPlaceholder />
                  )}
                  {sidebarView === "git" && (
                    <GitPlaceholder />
                  )}
                  {sidebarView === "debug" && (
                    <DebugPlaceholder />
                  )}
                  {sidebarView === "extensions" && (
                    <ExtensionsPlaceholder />
                  )}
                </div>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Code editor */}
          <ResizablePanel defaultSize={showSidebar ? 43 : 55} minSize={25}>
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
          <FileExplorer activeFile={activeFile} onSelectFile={(file) => {
            setActiveFile(file)
            setMobileTab("editor")
          }} />
        </div>
        <div className={cn("w-full h-full", mobileTab !== "editor" && "hidden")}>
          <CodeEditor activeFile={activeFile} onFileChange={setActiveFile} />
        </div>
        <div className={cn("w-full h-full", mobileTab !== "preview" && "hidden")}>
          <PreviewPanel />
        </div>
      </div>

      <MobileNav activeTab={mobileTab} onTabChange={handleMobileTabChange} />
    </div>
  )
}

/* Placeholder sidebar panels */
function SearchPlaceholder() {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search</span>
      </div>
      <div className="px-3 py-3">
        <div className="flex items-center gap-2 bg-secondary/50 rounded-md px-2.5 py-2 border border-border/50">
          <input
            type="text"
            placeholder="Search across files..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </div>
      <div className="px-3">
        <p className="text-xs text-muted-foreground">Type to search across all files in your project.</p>
      </div>
    </div>
  )
}

function GitPlaceholder() {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source Control</span>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 px-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
          <svg className="size-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3v12" /><path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
        </div>
        <p className="text-sm text-foreground font-medium mb-1">No changes</p>
        <p className="text-xs text-muted-foreground text-center">Your working tree is clean. Start editing files to see changes.</p>
      </div>
    </div>
  )
}

function DebugPlaceholder() {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Debug</span>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 px-6">
        <p className="text-xs text-muted-foreground text-center">Run your app to start debugging.</p>
      </div>
    </div>
  )
}

function ExtensionsPlaceholder() {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Extensions</span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        {["Tailwind CSS IntelliSense", "ESLint", "Prettier", "AI Copilot"].map((ext) => (
          <div key={ext} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-secondary/40 border border-border/50">
            <div className="w-8 h-8 rounded-md bg-primary/15 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">{ext[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-foreground font-medium truncate">{ext}</p>
              <p className="text-[10px] text-muted-foreground">Installed</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
