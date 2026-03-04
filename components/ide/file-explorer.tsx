"use client"

import { useState, useMemo } from "react"
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
  Trash2,
  RefreshCw,
  Upload,
  Download,
  Cloud,
  HardDrive,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  language?: string
  size?: string
}

const FILE_TREE: FileNode[] = [
  {
    name: "app",
    type: "folder",
    children: [
      { name: "layout.tsx", type: "file", language: "tsx", size: "1.2K" },
      { name: "page.tsx", type: "file", language: "tsx", size: "0.8K" },
      { name: "globals.css", type: "file", language: "css", size: "0.5K" },
      {
        name: "api",
        type: "folder",
        children: [
          {
            name: "chat",
            type: "folder",
            children: [{ name: "route.ts", type: "file", language: "ts", size: "0.6K" }],
          },
          {
            name: "health",
            type: "folder",
            children: [{ name: "route.ts", type: "file", language: "ts", size: "0.2K" }],
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
          { name: "button.tsx", type: "file", language: "tsx", size: "1.4K" },
          { name: "card.tsx", type: "file", language: "tsx", size: "0.9K" },
          { name: "input.tsx", type: "file", language: "tsx", size: "0.6K" },
          { name: "dialog.tsx", type: "file", language: "tsx", size: "1.1K" },
        ],
      },
      { name: "header.tsx", type: "file", language: "tsx", size: "0.7K" },
      { name: "sidebar.tsx", type: "file", language: "tsx", size: "0.9K" },
    ],
  },
  {
    name: "lib",
    type: "folder",
    children: [
      { name: "utils.ts", type: "file", language: "ts", size: "0.4K" },
      { name: "db.ts", type: "file", language: "ts", size: "0.8K" },
    ],
  },
  { name: "package.json", type: "file", language: "json", size: "0.5K" },
  { name: "tsconfig.json", type: "file", language: "json", size: "0.3K" },
  { name: "next.config.mjs", type: "file", language: "js", size: "0.2K" },
]

function getFileIcon(name: string, language?: string) {
  if (language === "json") return <FileJson className="size-3.5 text-syntax-variable shrink-0" />
  if (language === "tsx" || language === "ts" || language === "jsx") return <FileCode2 className="size-3.5 text-syntax-function shrink-0" />
  if (language === "css") return <FileType className="size-3.5 text-syntax-keyword shrink-0" />
  if (language === "js" || language === "mjs") return <FileCode2 className="size-3.5 text-syntax-variable shrink-0" />
  return <FileText className="size-3.5 text-muted-foreground shrink-0" />
}

function flattenFiles(nodes: FileNode[]): FileNode[] {
  const result: FileNode[] = []
  for (const node of nodes) {
    if (node.type === "file") result.push(node)
    if (node.children) result.push(...flattenFiles(node.children))
  }
  return result
}

function FileTreeItem({
  node,
  depth = 0,
  activeFile,
  onSelectFile,
  searchQuery,
}: {
  node: FileNode
  depth?: number
  activeFile: string
  onSelectFile: (name: string) => void
  searchQuery: string
}) {
  const [expanded, setExpanded] = useState(depth < 2 || !!searchQuery)

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 w-full px-2 py-[5px] hover:bg-accent/50 text-sm text-foreground transition-colors rounded-sm group"
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
          <span className="truncate flex-1 text-left">{node.name}</span>
          {node.children && (
            <span className="text-[9px] text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {node.children.length}
            </span>
          )}
        </button>
        {expanded && node.children && (
          <div>
            {node.children
              .sort((a, b) => {
                if (a.type === "folder" && b.type === "file") return -1
                if (a.type === "file" && b.type === "folder") return 1
                return a.name.localeCompare(b.name)
              })
              .map((child) => (
                <FileTreeItem
                  key={child.name}
                  node={child}
                  depth={depth + 1}
                  activeFile={activeFile}
                  onSelectFile={onSelectFile}
                  searchQuery={searchQuery}
                />
              ))}
          </div>
        )}
      </div>
    )
  }

  if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
    return null
  }

  return (
    <button
      onClick={() => onSelectFile(node.name)}
      className={cn(
        "flex items-center gap-1.5 w-full px-2 py-[5px] text-sm transition-colors rounded-sm group",
        activeFile === node.name
          ? "bg-primary/10 text-foreground"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
      )}
      style={{ paddingLeft: `${depth * 12 + 24}px` }}
    >
      {getFileIcon(node.name, node.language)}
      <span className="truncate flex-1 text-left">{node.name}</span>
      {node.size && (
        <span className="text-[9px] text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {node.size}
        </span>
      )}
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
  const [view, setView] = useState<"tree" | "flat">("tree")

  const allFiles = useMemo(() => flattenFiles(FILE_TREE), [])
  const filteredFlat = useMemo(
    () => searchQuery ? allFiles.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())) : allFiles,
    [searchQuery, allFiles]
  )

  const totalFiles = allFiles.length
  const totalFolders = FILE_TREE.reduce((count, node) => {
    const countFolders = (n: FileNode): number =>
      (n.type === "folder" ? 1 : 0) + (n.children?.reduce((c, ch) => c + countFolders(ch), 0) ?? 0)
    return count + countFolders(node)
  }, 0)

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explorer</span>
        <div className="flex items-center gap-0.5">
          <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="New file" title="New file">
            <Plus className="size-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="Upload" title="Upload file">
            <Upload className="size-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="Refresh" title="Refresh">
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Cloud workspace badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/50 bg-primary/3">
        <Cloud className="size-3 text-primary shrink-0" />
        <span className="text-[10px] text-primary/70 font-medium flex-1">Cloud Workspace</span>
        <span className="text-[9px] text-muted-foreground">{totalFiles} files</span>
      </div>

      {/* Search */}
      <div className="px-2 py-2 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-1.5 bg-secondary/50 rounded-lg px-2.5 py-1.5 border border-border/50 focus-within:border-primary/40 transition-colors">
          <Search className="size-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground shrink-0">
              <span className="text-[9px]">{filteredFlat.length}</span>
            </button>
          )}
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {searchQuery && view === "tree" ? (
          <div className="px-1">
            {filteredFlat.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No files match &quot;{searchQuery}&quot;</p>
            ) : (
              filteredFlat.map((node) => (
                <button
                  key={node.name}
                  onClick={() => onSelectFile(node.name)}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-1.5 text-sm transition-colors rounded-md",
                    activeFile === node.name ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                  )}
                >
                  {getFileIcon(node.name, node.language)}
                  <span className="truncate">{node.name}</span>
                  {node.size && <span className="text-[9px] text-muted-foreground/40 ml-auto shrink-0">{node.size}</span>}
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="px-1">
            {FILE_TREE.map((node) => (
              <FileTreeItem
                key={node.name}
                node={node}
                activeFile={activeFile}
                onSelectFile={onSelectFile}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer with workspace info */}
      <div className="px-3 py-2 border-t border-border shrink-0">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <HardDrive className="size-3" />
            <span>{totalFolders} folders, {totalFiles} files</span>
          </div>
          <span className="ml-auto flex items-center gap-1">
            <Database className="size-3" />
            Supabase
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </span>
        </div>
      </div>
    </div>
  )
}
