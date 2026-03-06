"use client"

import {
  Code2,
  Eye,
  FolderTree,
  Sparkles,
  Terminal,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type MobileTab = "chat" | "files" | "editor" | "preview" | "terminal" | "database"

const TABS: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
  { id: "chat", label: "AI", icon: <Sparkles className="size-[18px]" /> },
  { id: "files", label: "Files", icon: <FolderTree className="size-[18px]" /> },
  { id: "editor", label: "Code", icon: <Code2 className="size-[18px]" /> },
  { id: "terminal", label: "Term", icon: <Terminal className="size-[18px]" /> },
  { id: "preview", label: "Preview", icon: <Eye className="size-[18px]" /> },
  { id: "database", label: "DB", icon: <Database className="size-[18px]" /> },
]

export function MobileNav({
  activeTab,
  onTabChange,
}: {
  activeTab: MobileTab
  onTabChange: (tab: MobileTab) => void
}) {
  return (
    <nav className="flex items-center justify-around h-14 bg-panel-header border-t border-border md:hidden safe-area-inset-bottom shrink-0" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[44px] relative",
            activeTab === tab.id
              ? "text-primary"
              : "text-muted-foreground active:scale-95"
          )}
          aria-label={tab.label}
        >
          {activeTab === tab.id && (
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-b shadow-[0_0_6px_oklch(0.72_0.18_200/0.8)]" />
          )}
          {tab.icon}
          <span className="text-[9px] font-medium leading-none">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
