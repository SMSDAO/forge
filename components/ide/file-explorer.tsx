"use client"

import { useState, useMemo } from "react"
import {
  ChevronRight, ChevronDown, FileCode2, FileJson, FileText, FolderOpen, Folder,
  FileType, Search, Plus, Trash2, RefreshCw, Upload, Cloud, HardDrive, Database, X, Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { VFSFile } from "./code-editor"

/* ═══════════ Types ═══════════ */
interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  language?: string
  size?: string
}

const FILE_TREE: FileNode[] = [
  {
    name: "app", type: "folder", children: [
      { name: "layout.tsx", type: "file", language: "tsx", size: "1.2K" },
      { name: "page.tsx", type: "file", language: "tsx", size: "0.8K" },
      { name: "globals.css", type: "file", language: "css", size: "0.5K" },
      {
        name: "api", type: "folder", children: [
          { name: "chat", type: "folder", children: [{ name: "route.ts", type: "file", language: "ts", size: "0.6K" }] },
          { name: "health", type: "folder", children: [{ name: "route.ts", type: "file", language: "ts", size: "0.2K" }] },
        ],
      },
    ],
  },
  {
    name: "components", type: "folder", children: [
      {
        name: "ui", type: "folder", children: [
          { name: "button.tsx", type: "file", language: "tsx", size: "1.4K" },
          { name: "card.tsx", type: "file", language: "tsx", size: "0.9K" },
          { name: "input.tsx", type: "file", language: "tsx", size: "0.6K" },
        ],
      },
      { name: "header.tsx", type: "file", language: "tsx", size: "0.7K" },
    ],
  },
  {
    name: "lib", type: "folder", children: [
      { name: "utils.ts", type: "file", language: "ts", size: "0.4K" },
      { name: "db.ts", type: "file", language: "ts", size: "0.8K" },
    ],
  },
  { name: "package.json", type: "file", language: "json", size: "0.5K" },
  { name: "tsconfig.json", type: "file", language: "json", size: "0.3K" },
  { name: "next.config.mjs", type: "file", language: "js", size: "0.2K" },
]

function getIcon(name: string, lang?: string) {
  if (lang === "json") return <FileJson className="size-3.5 text-syntax-variable shrink-0" />
  if (lang === "tsx" || lang === "ts" || lang === "jsx") return <FileCode2 className="size-3.5 text-syntax-function shrink-0" />
  if (lang === "css") return <FileType className="size-3.5 text-syntax-keyword shrink-0" />
  if (lang === "js" || lang === "mjs") return <FileCode2 className="size-3.5 text-syntax-variable shrink-0" />
  return <FileText className="size-3.5 text-muted-foreground shrink-0" />
}

function flattenFiles(nodes: FileNode[]): FileNode[] {
  const r: FileNode[] = []
  for (const n of nodes) {
    if (n.type === "file") r.push(n)
    if (n.children) r.push(...flattenFiles(n.children))
  }
  return r
}

function countFolders(nodes: FileNode[]): number {
  return nodes.reduce((c, n) => c + (n.type === "folder" ? 1 : 0) + (n.children ? countFolders(n.children) : 0), 0)
}

/* ═══════════ Tree Item ═══════════ */
function TreeItem({ node, depth = 0, activeFile, onSelectFile, searchQuery }: {
  node: FileNode; depth?: number; activeFile: string; onSelectFile: (n: string) => void; searchQuery: string
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
          {expanded ? <ChevronDown className="size-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />}
          {expanded ? <FolderOpen className="size-4 text-primary shrink-0" /> : <Folder className="size-4 text-primary/70 shrink-0" />}
          <span className="truncate flex-1 text-left">{node.name}</span>
          {node.children && <span className="text-[9px] text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">{node.children.length}</span>}
        </button>
        {expanded && node.children && (
          <div>
            {node.children
              .sort((a, b) => { if (a.type !== b.type) return a.type === "folder" ? -1 : 1; return a.name.localeCompare(b.name) })
              .map(child => <TreeItem key={child.name} node={child} depth={depth + 1} activeFile={activeFile} onSelectFile={onSelectFile} searchQuery={searchQuery} />)
            }
          </div>
        )}
      </div>
    )
  }

  if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) return null

  return (
    <button
      onClick={() => onSelectFile(node.name)}
      className={cn(
        "flex items-center gap-1.5 w-full px-2 py-[5px] text-sm transition-colors rounded-sm group",
        activeFile === node.name ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
      )}
      style={{ paddingLeft: `${depth * 12 + 24}px` }}
    >
      {getIcon(node.name, node.language)}
      <span className="truncate flex-1 text-left">{node.name}</span>
      {node.size && <span className="text-[9px] text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">{node.size}</span>}
    </button>
  )
}

/* ═══════════ Main Component ═══════════ */
export function FileExplorer({
  activeFile, onSelectFile, vfs, onNewFile, onDeleteFile,
}: {
  activeFile: string
  onSelectFile: (name: string) => void
  vfs: Record<string, VFSFile>
  onNewFile: (name: string) => void
  onDeleteFile: (name: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewFile, setShowNewFile] = useState(false)
  const [newFileName, setNewFileName] = useState("")
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const allFiles = useMemo(() => flattenFiles(FILE_TREE), [])
  const vfsFileNames = Object.keys(vfs)
  const extraFiles = vfsFileNames.filter(n => !allFiles.find(f => f.name === n))
  const totalFiles = allFiles.length + extraFiles.length
  const totalFolders = countFolders(FILE_TREE)

  const filteredFlat = useMemo(() => {
    if (!searchQuery) return null
    const q = searchQuery.toLowerCase()
    const fromTree = allFiles.filter(f => f.name.toLowerCase().includes(q))
    const fromVfs = extraFiles.filter(n => n.toLowerCase().includes(q)).map(n => ({ name: n, type: "file" as const, language: n.split(".").pop() ?? "ts" }))
    return [...fromTree, ...fromVfs]
  }, [searchQuery, allFiles, extraFiles])

  const handleCreateFile = () => {
    if (!newFileName.trim()) return
    onNewFile(newFileName.trim())
    setNewFileName("")
    setShowNewFile(false)
    onSelectFile(newFileName.trim())
  }

  const handleDelete = (name: string) => {
    onDeleteFile(name)
    setConfirmDelete(null)
  }

  return (
    <div className="ide-panel bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-10 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explorer</span>
        <div className="flex items-center gap-0.5">
          <button onClick={() => setShowNewFile(true)} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="New file" title="New file">
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
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/50 bg-primary/[0.03]">
        <Cloud className="size-3 text-primary shrink-0" />
        <span className="text-[10px] text-primary/70 font-medium flex-1">Cloud Workspace</span>
        <span className="text-[9px] text-muted-foreground">{totalFiles} files</span>
      </div>

      {/* New file inline form */}
      {showNewFile && (
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-accent/20 animate-fade-slide">
          <input
            type="text"
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleCreateFile(); if (e.key === "Escape") setShowNewFile(false) }}
            placeholder="filename.tsx"
            className="flex-1 bg-secondary/50 rounded-md px-2 py-1.5 border border-border/50 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
            autoFocus
          />
          <button onClick={handleCreateFile} disabled={!newFileName.trim()} className="p-1 rounded bg-primary text-primary-foreground disabled:opacity-30" aria-label="Create">
            <Check className="size-3.5" />
          </button>
          <button onClick={() => setShowNewFile(false)} className="p-1 rounded text-muted-foreground hover:text-foreground" aria-label="Cancel">
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="px-2 py-2 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-1.5 bg-secondary/50 rounded-lg px-2.5 py-1.5 border border-border/50 focus-within:border-primary/40 transition-colors">
          <Search className="size-3.5 text-muted-foreground shrink-0" />
          <input
            type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 border-b border-destructive/20 animate-fade-slide">
          <span className="text-xs text-destructive flex-1 truncate">Delete {confirmDelete}?</span>
          <button onClick={() => handleDelete(confirmDelete)} className="px-2 py-1 rounded text-[10px] font-medium bg-destructive text-destructive-foreground">Delete</button>
          <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 rounded text-[10px] font-medium text-muted-foreground hover:text-foreground">Cancel</button>
        </div>
      )}

      {/* File tree */}
      <div className="ide-panel-scroll py-1">
        {filteredFlat ? (
          <div className="px-1">
            {filteredFlat.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No files match &quot;{searchQuery}&quot;</p>
            ) : (
              filteredFlat.map(node => (
                <button
                  key={node.name}
                  onClick={() => onSelectFile(node.name)}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-1.5 text-sm transition-colors rounded-md group",
                    activeFile === node.name ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                  )}
                >
                  {getIcon(node.name, node.language)}
                  <span className="truncate flex-1 text-left">{node.name}</span>
                  <button onClick={e => { e.stopPropagation(); setConfirmDelete(node.name) }} className="p-0.5 rounded text-muted-foreground/0 group-hover:text-muted-foreground/60 hover:text-destructive transition-colors shrink-0" aria-label={`Delete ${node.name}`}>
                    <Trash2 className="size-3" />
                  </button>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="px-1">
            {FILE_TREE.map(node => <TreeItem key={node.name} node={node} activeFile={activeFile} onSelectFile={onSelectFile} searchQuery={searchQuery} />)}
            {/* Extra VFS files not in tree */}
            {extraFiles.length > 0 && (
              <>
                <div className="px-2 pt-2 pb-1">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Created Files</span>
                </div>
                {extraFiles.map(name => (
                  <button
                    key={name}
                    onClick={() => onSelectFile(name)}
                    className={cn(
                      "flex items-center gap-1.5 w-full px-4 py-[5px] text-sm transition-colors rounded-sm group",
                      activeFile === name ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                    )}
                  >
                    {getIcon(name)}
                    <span className="truncate flex-1 text-left">{name}</span>
                    <button onClick={e => { e.stopPropagation(); setConfirmDelete(name) }} className="p-0.5 rounded text-muted-foreground/0 group-hover:text-muted-foreground/60 hover:text-destructive transition-colors shrink-0" aria-label={`Delete ${name}`}>
                      <Trash2 className="size-3" />
                    </button>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
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
