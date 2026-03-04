"use client"

import {
  MessageSquare,
  Code2,
  Eye,
  FolderTree,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type MobileTab = "chat" | "files" | "editor" | "preview"

const TABS: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
  { id: "chat", label: "AI Chat", icon: <Sparkles className="size-5" /> },
  { id: "files", label: "Files", icon: <FolderTree className="size-5" /> },
  { id: "editor", label: "Code", icon: <Code2 className="size-5" /> },
  { id: "preview", label: "Preview", icon: <Eye className="size-5" /> },
]

export function MobileNav({
  activeTab,
  onTabChange,
}: {
  activeTab: MobileTab
  onTabChange: (tab: MobileTab) => void
}) {
  return (
    <nav className="flex items-center justify-around h-14 bg-panel-header border-t border-border md:hidden safe-area-inset-bottom shrink-0">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[60px]",
            activeTab === tab.id
              ? "text-primary"
              : "text-muted-foreground"
          )}
          aria-label={tab.label}
        >
          {tab.icon}
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
