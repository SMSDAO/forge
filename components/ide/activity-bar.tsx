"use client"

import {
  Sparkles,
  FolderTree,
  Search,
  GitBranch,
  Terminal,
  Blocks,
  Database,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ActivityItem = "chat" | "files" | "search" | "git" | "debug" | "extensions" | "database"

const TOP_ITEMS: { id: ActivityItem; icon: React.ReactNode; label: string }[] = [
  { id: "chat", icon: <Sparkles className="size-[18px]" />, label: "AI Chat" },
  { id: "files", icon: <FolderTree className="size-[18px]" />, label: "Explorer" },
  { id: "search", icon: <Search className="size-[18px]" />, label: "Search" },
  { id: "git", icon: <GitBranch className="size-[18px]" />, label: "Source Control" },
  { id: "database", icon: <Database className="size-[18px]" />, label: "Database" },
  { id: "debug", icon: <Terminal className="size-[18px]" />, label: "Console" },
  { id: "extensions", icon: <Blocks className="size-[18px]" />, label: "Extensions" },
]

export function ActivityBar({
  activeItem,
  onItemChange,
}: {
  activeItem: ActivityItem
  onItemChange: (item: ActivityItem) => void
}) {
  return (
    <div className="hidden md:flex flex-col items-center justify-between w-11 bg-panel-header border-r border-border py-1.5 shrink-0">
      <div className="flex flex-col items-center gap-0.5">
        {TOP_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={cn(
              "relative p-2 rounded-lg transition-colors",
              activeItem === item.id
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
            aria-label={item.label}
            title={item.label}
          >
            {activeItem === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r shadow-[0_0_4px_oklch(0.72_0.18_200/0.8)]" />
            )}
            {item.icon}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <button
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          aria-label="Settings"
          title="Settings"
        >
          <Settings className="size-[18px]" />
        </button>
      </div>
    </div>
  )
}
