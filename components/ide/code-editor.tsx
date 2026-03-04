"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  X,
  FileCode2,
  FileJson,
  FileType,
  MoreHorizontal,
  Play,
  GitBranch,
  Copy,
  Check,
  Terminal,
  Sparkles,
  Bot,
  ChevronRight,
  Save,
  Undo2,
  Redo2,
  WrapText,
} from "lucide-react"

interface OpenTab {
  name: string
  language: string
  content: string
  modified: boolean
  savedContent: string
}

const FILE_CONTENTS: Record<string, { language: string; content: string }> = {
  "page.tsx": {
    language: "tsx",
    content: `import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Forge IDE
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-center">
            Start building your next project with AI assistance.
          </p>
          <div className="flex gap-2 justify-center">
            <Button>Get Started</Button>
            <Button variant="outline">Documentation</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}`,
  },
  "layout.tsx": {
    language: "tsx",
    content: `import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Forge App",
  description: "Built with Forge IDE",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
      </body>
    </html>
  )
}`,
  },
  "globals.css": {
    language: "css",
    content: `@import "tailwindcss";

:root {
  --background: oklch(0.1 0.005 260);
  --foreground: oklch(0.95 0 0);
  --primary: oklch(0.65 0.2 145);
  --primary-foreground: oklch(0.1 0.005 260);
}

@layer base {
  body {
    color: var(--foreground);
    background: var(--background);
  }
}`,
  },
  "route.ts": {
    language: "ts",
    content: `import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json()

    // Process chat messages with selected AI model
    const response = await generateAIResponse(messages, model)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function generateAIResponse(messages: any[], model: string) {
  // AI integration with dynamic model selection
  return "Hello from the API!"
}`,
  },
  "button.tsx": {
    language: "tsx",
    content: `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`,
  },
  "utils.ts": {
    language: "ts",
    content: `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}`,
  },
  "package.json": {
    language: "json",
    content: `{
  "name": "my-forge-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "next": "^16.1.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@supabase/supabase-js": "^2.45.0",
    "ai": "^6.0.0",
    "tailwindcss": "^4.2.0",
    "typescript": "^5.7.0"
  }
}`,
  },
  "db.ts": {
    language: "ts",
    content: `import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createProject(name: string, ownerId: string) {
  const { data, error } = await supabase
    .from("projects")
    .insert({ name, owner_id: ownerId })
    .select()
    .single()

  if (error) throw error
  return data
}`,
  },
}

const COPILOT_SUGGESTIONS: Record<string, { line: number; suggestion: string }> = {
  "page.tsx": { line: 18, suggestion: '          <Button variant="secondary">Learn More</Button>' },
  "route.ts": { line: 22, suggestion: '  const result = await fetch(process.env.AI_API_URL!, {' },
  "utils.ts": { line: 20, suggestion: "export function throttle<T extends (...args: any[]) => void>(fn: T, ms: number) {" },
  "db.ts": { line: 27, suggestion: "export async function deleteProject(id: string) {" },
}

function tokenize(code: string, language: string) {
  const tokens: { text: string; type: string }[] = []
  const keywords = [
    "import", "export", "from", "default", "function", "return", "const",
    "let", "var", "if", "else", "try", "catch", "async", "await", "new",
    "type", "interface", "extends", "class", "typeof", "instanceof", "throw",
    "switch", "case", "break", "continue", "for", "while", "of", "in",
  ]
  const builtins = ["true", "false", "null", "undefined", "void", "string", "number", "boolean", "any", "never"]

  const lines = code.split("\n")
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) tokens.push({ text: "\n", type: "plain" })

    let i = 0
    while (i < line.length) {
      if (line.slice(i, i + 2) === "//") {
        tokens.push({ text: line.slice(i), type: "comment" })
        break
      }
      if (line[i] === '"' || line[i] === "'" || line[i] === "`") {
        const quote = line[i]
        let j = i + 1
        while (j < line.length && line[j] !== quote) {
          if (line[j] === "\\") j++
          j++
        }
        tokens.push({ text: line.slice(i, j + 1), type: "string" })
        i = j + 1
        continue
      }
      if (/\d/.test(line[i]) && (i === 0 || !/\w/.test(line[i - 1]))) {
        let j = i
        while (j < line.length && /[\d.]/.test(line[j])) j++
        tokens.push({ text: line.slice(i, j), type: "number" })
        i = j
        continue
      }
      if (line[i] === "<" && (language === "tsx" || language === "jsx")) {
        const tagMatch = line.slice(i).match(/^<\/?([A-Za-z][A-Za-z0-9.]*)/)
        if (tagMatch) {
          tokens.push({ text: line[i], type: "plain" })
          i++
          if (line[i] === "/") {
            tokens.push({ text: "/", type: "plain" })
            i++
          }
          tokens.push({ text: tagMatch[1], type: "tag" })
          i += tagMatch[1].length
          continue
        }
      }
      if (line[i] === "@" && language === "css") {
        let j = i
        while (j < line.length && /[\w@-]/.test(line[j])) j++
        tokens.push({ text: line.slice(i, j), type: "keyword" })
        i = j
        continue
      }
      if (/[a-zA-Z_$]/.test(line[i])) {
        let j = i
        while (j < line.length && /[\w$]/.test(line[j])) j++
        const word = line.slice(i, j)
        if (keywords.includes(word)) {
          tokens.push({ text: word, type: "keyword" })
        } else if (builtins.includes(word)) {
          tokens.push({ text: word, type: "number" })
        } else if (i > 0 && line[i - 1] === ".") {
          tokens.push({ text: word, type: "function" })
        } else if (j < line.length && line[j] === "(") {
          tokens.push({ text: word, type: "function" })
        } else if (word === "process" || word === "console" || word === "Math" || word === "JSON") {
          tokens.push({ text: word, type: "function" })
        } else {
          tokens.push({ text: word, type: "variable" })
        }
        i = j
        continue
      }
      tokens.push({ text: line[i], type: "plain" })
      i++
    }
  })
  return tokens
}

function getTokenClass(type: string) {
  switch (type) {
    case "keyword": return "text-syntax-keyword"
    case "string": return "text-syntax-string"
    case "function": return "text-syntax-function"
    case "variable": return "text-syntax-variable"
    case "comment": return "text-syntax-comment italic"
    case "number": return "text-syntax-number"
    case "tag": return "text-syntax-tag"
    case "attr": return "text-syntax-attr"
    default: return "text-foreground/80"
  }
}

function getFileIcon(name: string) {
  if (name.endsWith(".json")) return <FileJson className="size-3.5 text-syntax-variable" />
  if (name.endsWith(".css")) return <FileType className="size-3.5 text-syntax-keyword" />
  return <FileCode2 className="size-3.5 text-syntax-function" />
}

export function CodeEditor({
  activeFile,
  onFileChange,
}: {
  activeFile: string
  onFileChange: (file: string) => void
}) {
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    { name: "page.tsx", language: "tsx", content: FILE_CONTENTS["page.tsx"].content, modified: false, savedContent: FILE_CONTENTS["page.tsx"].content },
    { name: "layout.tsx", language: "tsx", content: FILE_CONTENTS["layout.tsx"].content, modified: false, savedContent: FILE_CONTENTS["layout.tsx"].content },
  ])
  const [copied, setCopied] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalTab, setTerminalTab] = useState<"terminal" | "output" | "problems">("terminal")
  const [copilotEnabled, setCopilotEnabled] = useState(true)
  const [wordWrap, setWordWrap] = useState(false)
  const [cursorLine, setCursorLine] = useState(1)
  const [cursorCol, setCursorCol] = useState(1)
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState([
    { type: "cmd" as const, text: "pnpm dev --turbopack" },
    { type: "out" as const, text: "  Next.js 16.1.6 (turbopack)" },
    { type: "out" as const, text: "  Local: http://localhost:3000" },
    { type: "success" as const, text: "  Ready in 847ms" },
  ])
  const editorRef = useRef<HTMLDivElement>(null)

  const currentTab = openTabs.find((t) => t.name === activeFile)
  const content = currentTab?.content ?? FILE_CONTENTS[activeFile]?.content ?? "// No content"
  const language = currentTab?.language ?? FILE_CONTENTS[activeFile]?.language ?? "ts"

  const tokens = useMemo(() => tokenize(content, language), [content, language])
  const lines = content.split("\n")
  const lineCount = lines.length

  const copilotSuggestion = copilotEnabled ? COPILOT_SUGGESTIONS[activeFile] : null

  const openFile = useCallback((name: string) => {
    onFileChange(name)
    if (!openTabs.find((t) => t.name === name)) {
      const file = FILE_CONTENTS[name]
      if (file) {
        setOpenTabs((prev) => [...prev, { name, language: file.language, content: file.content, modified: false, savedContent: file.content }])
      }
    }
  }, [onFileChange, openTabs])

  const closeTab = useCallback((name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const filtered = openTabs.filter((t) => t.name !== name)
    setOpenTabs(filtered)
    if (activeFile === name && filtered.length > 0) {
      onFileChange(filtered[filtered.length - 1].name)
    }
  }, [openTabs, activeFile, onFileChange])

  const handleSave = useCallback(() => {
    setOpenTabs((prev) =>
      prev.map((t) =>
        t.name === activeFile ? { ...t, modified: false, savedContent: t.content } : t
      )
    )
  }, [activeFile])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleSave])

  const handleCopyAll = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTerminalCommand = () => {
    if (!terminalInput.trim()) return
    const cmd = terminalInput.trim()
    setTerminalHistory((prev) => [
      ...prev,
      { type: "cmd" as const, text: cmd },
      { type: "out" as const, text: `> ${cmd}` },
      { type: "success" as const, text: "  Done." },
    ])
    setTerminalInput("")
  }

  const problems = [
    { type: "warn" as const, file: "page.tsx", line: 5, text: "Unused import: CardHeader" },
  ]

  return (
    <div className="flex flex-col h-full bg-editor-bg">
      {/* Tab bar */}
      <div className="flex items-center bg-panel-header border-b border-border shrink-0">
        <div className="flex items-center min-w-0 flex-1 overflow-x-auto">
          {openTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => openFile(tab.name)}
              className={cn(
                "flex items-center gap-1.5 px-3 h-9 text-xs border-r border-border whitespace-nowrap transition-colors min-w-0 shrink-0 group",
                activeFile === tab.name
                  ? "bg-editor-bg text-foreground"
                  : "text-muted-foreground hover:text-foreground bg-panel-header"
              )}
            >
              {activeFile === tab.name && <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />}
              {getFileIcon(tab.name)}
              <span className="truncate max-w-[100px]">{tab.name}</span>
              {tab.modified && (
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              )}
              <button
                onClick={(e) => closeTab(tab.name, e)}
                className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-accent/50 shrink-0 ml-0.5 transition-opacity"
                aria-label={`Close ${tab.name}`}
              >
                <X className="size-3" />
              </button>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0.5 px-1.5 shrink-0 border-l border-border">
          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={cn("p-1.5 rounded transition-colors", wordWrap ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground")}
            title="Word wrap"
            aria-label="Toggle word wrap"
          >
            <WrapText className="size-3.5" />
          </button>
          <button
            onClick={() => setCopilotEnabled(!copilotEnabled)}
            className={cn(
              "flex items-center gap-1 px-1.5 py-1 rounded text-[10px] font-medium transition-colors",
              copilotEnabled ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            )}
            title={copilotEnabled ? "Copilot: On" : "Copilot: Off"}
          >
            <Sparkles className="size-3" />
            <span className="hidden sm:inline">Copilot</span>
          </button>
          <button
            onClick={handleCopyAll}
            className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
          </button>
          <button className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="More options">
            <MoreHorizontal className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 px-3 h-7 bg-editor-bg border-b border-border/30 text-[11px] text-muted-foreground shrink-0 overflow-x-auto">
        <span className="hover:text-foreground cursor-pointer transition-colors">app</span>
        <ChevronRight className="size-3 shrink-0" />
        <span className="text-foreground font-medium">{activeFile}</span>
        {currentTab?.modified && (
          <span className="text-primary text-[9px] ml-1">(modified)</span>
        )}
      </div>

      {/* Editor body */}
      <div ref={editorRef} className="flex-1 overflow-auto relative" onClick={() => setCursorLine(1)}>
        <div className="flex min-h-full">
          {/* Gutter */}
          <div className="flex flex-col items-end pt-2 pb-8 px-2 select-none shrink-0 bg-editor-bg border-r border-border/20 sticky left-0 z-10">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="flex items-center h-[22px]">
                <span
                  className={cn(
                    "text-[11px] font-mono leading-[22px] min-w-[3ch] text-right transition-colors",
                    cursorLine === i + 1 ? "text-foreground" :
                    copilotSuggestion?.line === i + 1 ? "text-primary/60" :
                    "text-editor-gutter"
                  )}
                >
                  {i + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Code content */}
          <div className={cn("flex-1 pt-2 pb-8 px-4 relative", wordWrap ? "whitespace-pre-wrap break-all" : "overflow-x-auto")}>
            {/* Highlight current line */}
            <div
              className="absolute left-0 right-0 h-[22px] bg-editor-line/40 pointer-events-none transition-transform"
              style={{ top: `${(cursorLine - 1) * 22 + 8}px` }}
            />
            <pre className={cn(wordWrap && "whitespace-pre-wrap break-all")}>
              <code className="text-[13px] font-mono leading-[22px]">
                {tokens.map((token, i) => (
                  <span key={i} className={getTokenClass(token.type)}>{token.text}</span>
                ))}
              </code>
            </pre>

            {/* Copilot ghost text */}
            {copilotEnabled && copilotSuggestion && (
              <div
                className="absolute left-4 pointer-events-none"
                style={{ top: `${copilotSuggestion.line * 22 + 8}px` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-mono leading-[22px] text-primary/25 italic">{copilotSuggestion.suggestion}</span>
                  <span className="text-[8px] px-1 py-0.5 rounded bg-primary/8 text-primary/40 font-sans border border-primary/10">Tab</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 h-7 bg-primary/8 border-t border-border text-[10px] text-muted-foreground shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={cn("flex items-center gap-1 transition-colors", showTerminal ? "text-primary" : "hover:text-foreground")}
          >
            <Terminal className="size-3" />
            <span>Terminal</span>
          </button>
          <span className="flex items-center gap-1">
            <GitBranch className="size-3" />
            main
          </span>
          {copilotEnabled && (
            <span className="flex items-center gap-1 text-primary/70">
              <Sparkles className="size-2.5" />
              Copilot
            </span>
          )}
          {currentTab?.modified && (
            <button onClick={handleSave} className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
              <Save className="size-2.5" />
              <span>Save</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">{language.toUpperCase()}</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span>Ln {cursorLine}, Col {cursorCol}</span>
          {problems.length > 0 && (
            <button
              onClick={() => { setShowTerminal(true); setTerminalTab("problems") }}
              className="flex items-center gap-1 text-amber-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {problems.length}
            </button>
          )}
        </div>
      </div>

      {/* Terminal panel */}
      {showTerminal && (
        <div className="h-44 border-t border-border bg-background shrink-0 flex flex-col">
          <div className="flex items-center justify-between px-3 h-8 bg-panel-header border-b border-border shrink-0">
            <div className="flex items-center gap-0.5">
              {(["terminal", "output", "problems"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTerminalTab(tab)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors",
                    terminalTab === tab ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === "terminal" && <Terminal className="size-3" />}
                  {tab}
                  {tab === "problems" && problems.length > 0 && (
                    <span className="text-[9px] px-1 py-0.5 rounded-full bg-amber-500/15 text-amber-400 leading-none">{problems.length}</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTerminal(false)}
              className="p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close terminal"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 font-mono text-xs">
            {terminalTab === "terminal" && (
              <>
                {terminalHistory.map((entry, i) => (
                  <div key={i} className="leading-relaxed">
                    {entry.type === "cmd" ? (
                      <span><span className="text-primary">$</span> <span className="text-foreground">{entry.text}</span></span>
                    ) : entry.type === "success" ? (
                      <span className="text-primary/80">{entry.text}</span>
                    ) : (
                      <span className="text-muted-foreground">{entry.text}</span>
                    )}
                  </div>
                ))}
              </>
            )}
            {terminalTab === "output" && (
              <div className="text-muted-foreground">
                <p className="text-primary">Forge IDE v3.0 - Cloud Engine</p>
                <p>Compiled client and server in 1.2s</p>
                <p>Watching for file changes...</p>
              </div>
            )}
            {terminalTab === "problems" && (
              <div>
                {problems.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 px-1 py-1 hover:bg-accent/20 rounded transition-colors cursor-pointer">
                    <span className={cn("text-[9px] font-semibold px-1 py-0.5 rounded", p.type === "warn" ? "text-amber-400 bg-amber-500/10" : "text-red-400 bg-red-500/10")}>
                      {p.type === "warn" ? "WARN" : "ERR"}
                    </span>
                    <span className="text-foreground">{p.text}</span>
                    <span className="text-muted-foreground ml-auto shrink-0">{p.file}:{p.line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {terminalTab === "terminal" && (
            <div className="flex items-center gap-2 px-3 py-1.5 border-t border-border shrink-0">
              <span className="text-primary text-xs font-mono shrink-0">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTerminalCommand()}
                placeholder="Enter command..."
                className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
