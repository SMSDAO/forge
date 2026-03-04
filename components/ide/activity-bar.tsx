"use client"

import {
  Sparkles,
  FolderTree,
  Search,
  GitBranch,
  Bug,
  Blocks,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ActivityItem = "chat" | "files" | "search" | "git" | "debug" | "extensions"

const ITEMS: { id: ActivityItem; icon: React.ReactNode; label: string }[] = [
  { id: "chat", icon: <Sparkles className="size-5" />, label: "AI Chat" },
  { id: "files", icon: <FolderTree className="size-5" />, label: "Explorer" },
  { id: "search", icon: <Search className="size-5" />, label: "Search" },
  { id: "git", icon: <GitBranch className="size-5" />, label: "Source Control" },
  { id: "debug", icon: <Bug className="size-5" />, label: "Debug" },
  { id: "extensions", icon: <Blocks className="size-5" />, label: "Extensions" },
]

export function ActivityBar({
  activeItem,
  onItemChange,
}: {
  activeItem: ActivityItem
  onItemChange: (item: ActivityItem) => void
}) {
  return (
    <div className="hidden md:flex flex-col items-center justify-between w-12 bg-panel-header border-r border-border py-2 shrink-0">
      <div className="flex flex-col items-center gap-1">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={cn(
              "relative p-2 rounded-lg transition-colors",
              activeItem === item.id
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
            aria-label={item.label}
            title={item.label}
          >
            {activeItem === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r" />
            )}
            {item.icon}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1">
        <button
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          aria-label="Settings"
          title="Settings"
        >
          <Settings className="size-5" />
        </button>
      </div>
    </div>
  )
}
