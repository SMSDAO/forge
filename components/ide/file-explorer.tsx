"use client"

import { useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  FileCode2,
  FileJson,
  FileText,
  FolderOpen,
  Folder,
  FileType,
  Search,
  Plus,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  language?: string
}

const FILE_TREE: FileNode[] = [
  {
    name: "app",
    type: "folder",
    children: [
      { name: "layout.tsx", type: "file", language: "tsx" },
      { name: "page.tsx", type: "file", language: "tsx" },
      { name: "globals.css", type: "file", language: "css" },
      {
        name: "api",
        type: "folder",
        children: [
          {
            name: "chat",
            type: "folder",
            children: [{ name: "route.ts", type: "file", language: "ts" }],
          },
        ],
      },
    ],
  },
  {
    name: "components",
    type: "folder",
    children: [
      {
        name: "ui",
        type: "folder",
        children: [
          { name: "button.tsx", type: "file", language: "tsx" },
          { name: "card.tsx", type: "file", language: "tsx" },
          { name: "input.tsx", type: "file", language: "tsx" },
          { name: "dialog.tsx", type: "file", language: "tsx" },
        ],
      },
      { name: "header.tsx", type: "file", language: "tsx" },
      { name: "sidebar.tsx", type: "file", language: "tsx" },
    ],
  },
  {
    name: "lib",
    type: "folder",
    children: [
      { name: "utils.ts", type: "file", language: "ts" },
    ],
  },
  { name: "package.json", type: "file", language: "json" },
  { name: "tsconfig.json", type: "file", language: "json" },
  { name: "next.config.mjs", type: "file", language: "js" },
  { name: "tailwind.config.ts", type: "file", language: "ts" },
]

function getFileIcon(name: string, language?: string) {
  if (language === "json") return <FileJson className="size-4 text-syntax-variable" />
  if (language === "tsx" || language === "ts") return <FileCode2 className="size-4 text-syntax-function" />
  if (language === "css") return <FileType className="size-4 text-syntax-keyword" />
  if (language === "js" || language === "mjs") return <FileCode2 className="size-4 text-syntax-variable" />
  return <FileText className="size-4 text-muted-foreground" />
}

function FileTreeItem({
  node,
  depth = 0,
  activeFile,
  onSelectFile,
}: {
  node: FileNode
  depth?: number
  activeFile: string
  onSelectFile: (name: string) => void
}) {
  const [expanded, setExpanded] = useState(depth < 2)

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 w-full px-2 py-1 hover:bg-accent/60 text-sm text-foreground transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {expanded ? (
            <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
          )}
          {expanded ? (
            <FolderOpen className="size-4 text-primary shrink-0" />
          ) : (
            <Folder className="size-4 text-primary/70 shrink-0" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {expanded && node.children && (
          <div>
            {node.children.map((child) => (
              <FileTreeItem
                key={child.name}
                node={child}
                depth={depth + 1}
                activeFile={activeFile}
                onSelectFile={onSelectFile}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => onSelectFile(node.name)}
      className={cn(
        "flex items-center gap-1.5 w-full px-2 py-1 text-sm transition-colors",
        activeFile === node.name
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
      )}
      style={{ paddingLeft: `${depth * 12 + 24}px` }}
    >
      {getFileIcon(node.name, node.language)}
      <span className="truncate">{node.name}</span>
    </button>
  )
}

export function FileExplorer({
  activeFile,
  onSelectFile,
}: {
  activeFile: string
  onSelectFile: (name: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Explorer
        </span>
        <div className="flex items-center gap-0.5">
          <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="New file">
            <Plus className="size-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="More options">
            <MoreHorizontal className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-2 py-2 border-b border-border">
        <div className="flex items-center gap-1.5 bg-secondary/50 rounded-md px-2 py-1">
          <Search className="size-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {FILE_TREE.map((node) => (
            <FileTreeItem
              key={node.name}
              node={node}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
