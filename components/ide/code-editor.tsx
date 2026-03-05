"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  X, FileCode2, FileJson, FileType, Copy, Check, Terminal,
  Sparkles, ChevronRight, Save, WrapText, Play, GitBranch, MoreHorizontal
} from "lucide-react"

/* ═══════════ Virtual file system ═══════════ */
export interface VFSFile { language: string; content: string }

export const FILE_CONTENTS: Record<string, VFSFile> = {
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
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
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
    month: "short", day: "numeric", year: "numeric",
  }).format(date)
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T, ms: number
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
    "db:push": "drizzle-kit push"
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

/* ═══════════ Tokenizer ═══════════ */
const KEYWORDS = new Set([
  "import","export","from","default","function","return","const","let","var",
  "if","else","try","catch","async","await","new","type","interface","extends",
  "class","typeof","instanceof","throw","switch","case","break","continue","for","while","of","in",
])
const BUILTINS = new Set(["true","false","null","undefined","void","string","number","boolean","any","never"])
const GLOBALS = new Set(["process","console","Math","JSON","Promise","Error","Array","Object","Map","Set"])

function tokenize(code: string, language: string) {
  const tokens: { text: string; type: string }[] = []
  const lines = code.split("\n")
  lines.forEach((line, li) => {
    if (li > 0) tokens.push({ text: "\n", type: "plain" })
    let i = 0
    while (i < line.length) {
      if (line.slice(i, i + 2) === "//") { tokens.push({ text: line.slice(i), type: "comment" }); break }
      if (line[i] === '"' || line[i] === "'" || line[i] === "`") {
        const q = line[i]; let j = i + 1
        while (j < line.length && line[j] !== q) { if (line[j] === "\\") j++; j++ }
        tokens.push({ text: line.slice(i, j + 1), type: "string" }); i = j + 1; continue
      }
      if (/\d/.test(line[i]) && (i === 0 || !/\w/.test(line[i - 1]))) {
        let j = i; while (j < line.length && /[\d.]/.test(line[j])) j++
        tokens.push({ text: line.slice(i, j), type: "number" }); i = j; continue
      }
      if (line[i] === "<" && (language === "tsx" || language === "jsx")) {
        const m = line.slice(i).match(/^<\/?([A-Za-z][A-Za-z0-9.]*)/)
        if (m) {
          tokens.push({ text: line[i], type: "plain" }); i++
          if (line[i] === "/") { tokens.push({ text: "/", type: "plain" }); i++ }
          tokens.push({ text: m[1], type: "tag" }); i += m[1].length; continue
        }
      }
      if (line[i] === "@" && language === "css") {
        let j = i; while (j < line.length && /[\w@-]/.test(line[j])) j++
        tokens.push({ text: line.slice(i, j), type: "keyword" }); i = j; continue
      }
      if (/[a-zA-Z_$]/.test(line[i])) {
        let j = i; while (j < line.length && /[\w$]/.test(line[j])) j++
        const w = line.slice(i, j)
        const t = KEYWORDS.has(w) ? "keyword" : BUILTINS.has(w) ? "number"
          : GLOBALS.has(w) ? "function" : (i > 0 && line[i-1] === ".") ? "function"
          : (j < line.length && line[j] === "(") ? "function" : "variable"
        tokens.push({ text: w, type: t }); i = j; continue
      }
      tokens.push({ text: line[i], type: "plain" }); i++
    }
  })
  return tokens
}

function tokenClass(type: string) {
  const map: Record<string, string> = {
    keyword: "text-syntax-keyword", string: "text-syntax-string", function: "text-syntax-function",
    variable: "text-syntax-variable", comment: "text-syntax-comment italic",
    number: "text-syntax-number", tag: "text-syntax-tag", attr: "text-syntax-attr",
  }
  return map[type] ?? "text-foreground/80"
}

function fileIcon(name: string) {
  if (name.endsWith(".json")) return <FileJson className="size-3.5 text-syntax-variable" />
  if (name.endsWith(".css")) return <FileType className="size-3.5 text-syntax-keyword" />
  return <FileCode2 className="size-3.5 text-syntax-function" />
}

/* ═══════════ Component ═══════════ */
export function CodeEditor({
  activeFile, onFileChange, vfs, onVfsUpdate,
}: {
  activeFile: string
  onFileChange: (f: string) => void
  vfs: Record<string, VFSFile>
  onVfsUpdate: (name: string, content: string) => void
}) {
  const [openTabs, setOpenTabs] = useState<string[]>(["page.tsx", "layout.tsx"])
  const [copied, setCopied] = useState(false)
  const [showTerminal, setShowTerminal] = useState(true)
  const [termTab, setTermTab] = useState<"terminal" | "output" | "problems">("terminal")
  const [copilotOn, setCopilotOn] = useState(true)
  const [wordWrap, setWordWrap] = useState(false)
  const [termInput, setTermInput] = useState("")
  const [termHistory, setTermHistory] = useState([
    { t: "sys", v: "Forge Cloud Terminal v3.0 -- Node 20.11 | pnpm 9.1" },
    { t: "cmd", v: "pnpm dev --turbopack" },
    { t: "out", v: "  Next.js 16.1.6 (turbopack)" },
    { t: "out", v: "  Local: http://localhost:3000" },
    { t: "ok",  v: "  Ready in 847ms" },
  ])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const termEndRef = useRef<HTMLDivElement>(null)

  // Open tab when file changes
  useEffect(() => {
    if (activeFile && !openTabs.includes(activeFile)) {
      setOpenTabs(prev => [...prev, activeFile])
    }
  }, [activeFile, openTabs])

  // Scroll terminal to bottom
  useEffect(() => { termEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [termHistory])

  const file = vfs[activeFile]
  const content = file?.content ?? "// Select a file"
  const language = file?.language ?? "ts"
  const lines = content.split("\n")
  const tokens = useMemo(() => tokenize(content, language), [content, language])

  // Sync textarea scroll with pre
  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop
      preRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onVfsUpdate(activeFile, e.target.value)
  }, [activeFile, onVfsUpdate])

  const handleTabKey = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const ta = e.currentTarget
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newVal = content.substring(0, start) + "  " + content.substring(end)
      onVfsUpdate(activeFile, newVal)
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2 })
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault() }
  }, [content, activeFile, onVfsUpdate])

  const closeTab = (name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = openTabs.filter(t => t !== name)
    setOpenTabs(next)
    if (activeFile === name && next.length > 0) onFileChange(next[next.length - 1])
  }

  const handleCopy = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const handleTermCmd = () => {
    if (!termInput.trim()) return
    const cmd = termInput.trim()
    const responses: Record<string, string[]> = {
      "ls": ["app/  components/  lib/  package.json  tsconfig.json  next.config.mjs"],
      "pwd": ["/home/forge/my-forge-app"],
      "node -v": ["v20.11.0"],
      "pnpm -v": ["9.1.0"],
      "git status": ["On branch main", "nothing to commit, working tree clean"],
      "clear": [],
    }
    if (cmd === "clear") { setTermHistory([{ t: "sys", v: "Forge Cloud Terminal v3.0" }]); setTermInput(""); return }
    const out = responses[cmd]
    setTermHistory(prev => [
      ...prev,
      { t: "cmd", v: cmd },
      ...(out ? out.map(v => ({ t: "out", v })) : [{ t: "out", v: `$ ${cmd}` }, { t: "ok", v: "Done." }]),
    ])
    setTermInput("")
  }

  const problems = [{ type: "warn" as const, file: "page.tsx", line: 5, text: "Unused import: CardHeader" }]
  const curLine = (() => {
    if (!textareaRef.current) return 1
    const val = textareaRef.current.value.substring(0, textareaRef.current.selectionStart)
    return val.split("\n").length
  })()

  return (
    <div className="ide-panel bg-editor-bg">
      {/* Tab bar */}
      <div className="flex items-center bg-panel-header border-b border-border shrink-0">
        <div className="flex items-center flex-1 min-w-0 tab-row">
          {openTabs.map(name => (
            <button
              key={name}
              onClick={() => onFileChange(name)}
              className={cn(
                "relative flex items-center gap-1.5 px-3 h-9 text-xs border-r border-border whitespace-nowrap transition-colors shrink-0 group",
                activeFile === name ? "bg-editor-bg text-foreground" : "text-muted-foreground hover:text-foreground bg-panel-header"
              )}
            >
              {activeFile === name && <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />}
              {fileIcon(name)}
              <span className="truncate max-w-[100px]">{name}</span>
              {vfs[name] && vfs[name].content !== FILE_CONTENTS[name]?.content && (
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              )}
              <button onClick={e => closeTab(name, e)} className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-accent/50 shrink-0 ml-0.5 transition-opacity" aria-label={`Close ${name}`}>
                <X className="size-3" />
              </button>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0.5 px-1.5 shrink-0 border-l border-border">
          <button onClick={() => setWordWrap(!wordWrap)} className={cn("p-1.5 rounded transition-colors", wordWrap ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground")} title="Word wrap" aria-label="Toggle word wrap">
            <WrapText className="size-3.5" />
          </button>
          <button onClick={() => setCopilotOn(!copilotOn)} className={cn("flex items-center gap-1 px-1.5 py-1 rounded text-[10px] font-medium transition-colors", copilotOn ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground")} title={copilotOn ? "Copilot: On" : "Copilot: Off"}>
            <Sparkles className="size-3" /><span className="hidden sm:inline">Copilot</span>
          </button>
          <button onClick={handleCopy} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="Copy code">
            {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 px-3 h-7 bg-editor-bg border-b border-border/30 text-[11px] text-muted-foreground shrink-0 tab-row">
        <span className="hover:text-foreground cursor-pointer transition-colors">app</span>
        <ChevronRight className="size-3 shrink-0" />
        <span className="text-foreground font-medium">{activeFile}</span>
        {vfs[activeFile] && vfs[activeFile].content !== FILE_CONTENTS[activeFile]?.content && (
          <span className="text-primary text-[9px] ml-1">(modified)</span>
        )}
      </div>

      {/* Editor body -- actual editable code */}
      <div className="ide-panel-scroll relative">
        <div className="flex min-h-full">
          {/* Gutter */}
          <div className="flex flex-col items-end pt-2 pb-8 px-2 select-none shrink-0 bg-editor-bg border-r border-border/20 sticky left-0 z-10" aria-hidden="true">
            {lines.map((_, i) => (
              <div key={i} className="h-[22px] flex items-center">
                <span className={cn("text-[11px] font-mono leading-[22px] min-w-[3ch] text-right", curLine === i + 1 ? "text-foreground" : "text-editor-gutter")}>{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Code area with overlay textarea */}
          <div className="flex-1 relative min-h-full">
            {/* Syntax-highlighted layer */}
            <pre
              ref={preRef}
              className={cn("pt-2 pb-8 px-4 pointer-events-none overflow-hidden", wordWrap ? "whitespace-pre-wrap break-all" : "whitespace-pre")}
              aria-hidden="true"
            >
              <code className="text-[13px] font-mono leading-[22px]">
                {tokens.map((tok, i) => (
                  <span key={i} className={tokenClass(tok.type)}>{tok.text}</span>
                ))}
              </code>
            </pre>

            {/* Editable textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextChange}
              onScroll={handleScroll}
              onKeyDown={handleTabKey}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className={cn("editor-textarea font-mono pl-4", wordWrap && "whitespace-pre-wrap break-all")}
              aria-label={`Edit ${activeFile}`}
            />

            {/* Copilot ghost suggestion */}
            {copilotOn && activeFile === "page.tsx" && (
              <div className="absolute left-4 pointer-events-none" style={{ top: `${18 * 22 + 8}px` }}>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-mono leading-[22px] text-primary/20 italic">{'          <Button variant="secondary">Learn More</Button>'}</span>
                  <span className="text-[8px] px-1 py-0.5 rounded bg-primary/8 text-primary/30 font-sans border border-primary/10">Tab</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 h-7 bg-primary/8 border-t border-border text-[10px] text-muted-foreground shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowTerminal(!showTerminal)} className={cn("flex items-center gap-1 transition-colors", showTerminal ? "text-primary" : "hover:text-foreground")}>
            <Terminal className="size-3" /><span>Terminal</span>
          </button>
          <span className="flex items-center gap-1"><GitBranch className="size-3" />main</span>
          {copilotOn && <span className="flex items-center gap-1 text-primary/70"><Sparkles className="size-2.5" />Copilot</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">{language.toUpperCase()}</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span>Ln {curLine}</span>
          {problems.length > 0 && (
            <button onClick={() => { setShowTerminal(true); setTermTab("problems") }} className="flex items-center gap-1 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{problems.length}
            </button>
          )}
        </div>
      </div>

      {/* Terminal panel */}
      {showTerminal && (
        <div className="h-48 border-t border-border bg-background shrink-0 flex flex-col">
          <div className="flex items-center justify-between px-3 h-8 bg-panel-header border-b border-border shrink-0">
            <div className="flex items-center gap-0.5">
              {(["terminal", "output", "problems"] as const).map(tab => (
                <button key={tab} onClick={() => setTermTab(tab)} className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors", termTab === tab ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground")}>
                  {tab === "terminal" && <Terminal className="size-3" />}
                  {tab}
                  {tab === "problems" && problems.length > 0 && (
                    <span className="text-[9px] px-1 py-0.5 rounded-full bg-amber-500/15 text-amber-400 leading-none">{problems.length}</span>
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => setShowTerminal(false)} className="p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="Close terminal">
              <X className="size-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 font-mono text-xs">
            {termTab === "terminal" && (
              <>
                {termHistory.map((e, i) => (
                  <div key={i} className={cn("leading-relaxed", e.t === "cmd" && "mt-1")}>
                    {e.t === "cmd" ? <span><span className="text-primary">$</span> <span className="text-foreground">{e.v}</span></span>
                      : e.t === "ok" ? <span className="text-primary/80">{e.v}</span>
                      : e.t === "sys" ? <span className="text-muted-foreground/60">{e.v}</span>
                      : <span className="text-muted-foreground">{e.v}</span>}
                  </div>
                ))}
                <div ref={termEndRef} />
              </>
            )}
            {termTab === "output" && (
              <div className="text-muted-foreground">
                <p className="text-primary">Forge IDE v3.0 - Cloud Engine</p>
                <p>Compiled client and server in 1.2s</p>
                <p>Watching for file changes...</p>
              </div>
            )}
            {termTab === "problems" && (
              <div>
                {problems.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 px-1 py-1 hover:bg-accent/20 rounded transition-colors cursor-pointer">
                    <span className="text-[9px] font-semibold px-1 py-0.5 rounded text-amber-400 bg-amber-500/10">WARN</span>
                    <span className="text-foreground">{p.text}</span>
                    <span className="text-muted-foreground ml-auto shrink-0">{p.file}:{p.line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {termTab === "terminal" && (
            <div className="flex items-center gap-2 px-3 py-1.5 border-t border-border shrink-0">
              <span className="text-primary text-xs font-mono shrink-0">$</span>
              <input
                type="text"
                value={termInput}
                onChange={e => setTermInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleTermCmd() }}
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
