"use client"

import {
  Sparkles,
  FolderTree,
  Search,
  GitBranch,
  Terminal,
  Blocks,
  Settings,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ActivityItem = "chat" | "files" | "search" | "git" | "debug" | "extensions"

const ITEMS: { id: ActivityItem; icon: React.ReactNode; label: string }[] = [
  { id: "chat", icon: <Sparkles className="size-[18px]" />, label: "AI Chat" },
  { id: "files", icon: <FolderTree className="size-[18px]" />, label: "Explorer" },
  { id: "search", icon: <Search className="size-[18px]" />, label: "Search" },
  { id: "git", icon: <GitBranch className="size-[18px]" />, label: "Source Control" },
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
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r" />
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
