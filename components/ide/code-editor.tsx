"use client"

import { useState, useMemo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  X,
  FileCode2,
  FileJson,
  MoreHorizontal,
  Play,
  GitBranch,
  Copy,
  Check,
  Terminal,
} from "lucide-react"

interface OpenTab {
  name: string
  language: string
  content: string
  modified?: boolean
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
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My App",
  description: "Built with Forge IDE",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}`,
  },
  "globals.css": {
    language: "css",
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0a0a12;
  --foreground: #e8e8ef;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}`,
  },
  "route.ts": {
    language: "ts",
    content: `import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Process chat messages with AI
    const response = await generateAIResponse(messages)

    return NextResponse.json({ response })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function generateAIResponse(messages: any[]) {
  // AI integration goes here
  return "Hello from the API!"
}`,
  },
  "button.tsx": {
    language: "tsx",
    content: `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
}`,
  },
  "package.json": {
    language: "json",
    content: `{
  "name": "my-forge-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0"
  }
}`,
  },
}

function tokenize(code: string, language: string) {
  const tokens: { text: string; type: string }[] = []
  const keywords = ["import", "export", "from", "default", "function", "return", "const", "let", "var", "if", "else", "try", "catch", "async", "await", "new", "type", "interface", "extends", "class", "typeof", "instanceof"]
  const builtins = ["true", "false", "null", "undefined", "void", "string", "number", "boolean", "any"]

  const lines = code.split("\n")
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) tokens.push({ text: "\n", type: "plain" })

    let i = 0
    while (i < line.length) {
      // Comments
      if (line.slice(i, i + 2) === "//") {
        tokens.push({ text: line.slice(i), type: "comment" })
        break
      }
      // Strings
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
      // Numbers
      if (/\d/.test(line[i]) && (i === 0 || !/\w/.test(line[i - 1]))) {
        let j = i
        while (j < line.length && /[\d.]/.test(line[j])) j++
        tokens.push({ text: line.slice(i, j), type: "number" })
        i = j
        continue
      }
      // JSX/HTML tags
      if (line[i] === "<" && language === "tsx") {
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
      // Words
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
        } else {
          tokens.push({ text: word, type: "variable" })
        }
        i = j
        continue
      }
      // Braces / operators
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
    case "comment": return "text-syntax-comment"
    case "number": return "text-syntax-number"
    case "tag": return "text-syntax-tag"
    case "attr": return "text-syntax-attr"
    default: return "text-foreground"
  }
}

export function CodeEditor({
  activeFile,
  onFileChange,
}: {
  activeFile: string
  onFileChange: (file: string) => void
}) {
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    { name: "page.tsx", language: "tsx", content: FILE_CONTENTS["page.tsx"].content },
    { name: "layout.tsx", language: "tsx", content: FILE_CONTENTS["layout.tsx"].content },
  ])
  const [copied, setCopied] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)

  const currentTab = openTabs.find((t) => t.name === activeFile)
  const content = currentTab?.content ?? FILE_CONTENTS[activeFile]?.content ?? "// No content"
  const language = currentTab?.language ?? FILE_CONTENTS[activeFile]?.language ?? "ts"

  const tokens = useMemo(() => tokenize(content, language), [content, language])
  const lineCount = content.split("\n").length

  const handleCloseTab = (name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const filtered = openTabs.filter((t) => t.name !== name)
    setOpenTabs(filtered)
    if (activeFile === name && filtered.length > 0) {
      onFileChange(filtered[filtered.length - 1].name)
    }
  }

  const handleTabClick = (name: string) => {
    onFileChange(name)
    if (!openTabs.find((t) => t.name === name)) {
      const file = FILE_CONTENTS[name]
      if (file) {
        setOpenTabs((prev) => [...prev, { name, language: file.language, content: file.content }])
      }
    }
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-editor-bg">
      {/* Tab bar */}
      <div className="flex items-center bg-panel-header border-b border-border shrink-0 overflow-x-auto">
        <div className="flex items-center min-w-0">
          {openTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.name)}
              className={cn(
                "flex items-center gap-1.5 px-3 h-9 text-xs border-r border-border whitespace-nowrap transition-colors min-w-0 shrink-0",
                activeFile === tab.name
                  ? "bg-editor-bg text-foreground border-t-2 border-t-primary"
                  : "text-muted-foreground hover:text-foreground bg-panel-header"
              )}
            >
              {tab.language === "json" ? (
                <FileJson className="size-3.5 shrink-0 text-syntax-variable" />
              ) : (
                <FileCode2 className="size-3.5 shrink-0 text-syntax-function" />
              )}
              <span className="truncate">{tab.name}</span>
              {tab.modified && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
              <button
                onClick={(e) => handleCloseTab(tab.name, e)}
                className="p-0.5 rounded hover:bg-accent/50 shrink-0 ml-1"
                aria-label={`Close ${tab.name}`}
              >
                <X className="size-3" />
              </button>
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1 px-2 shrink-0">
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

      {/* Editor body */}
      <ScrollArea className="flex-1">
        <div className="flex min-h-full">
          {/* Gutter */}
          <div className="flex flex-col items-end pt-3 pb-3 px-3 select-none shrink-0 bg-editor-bg border-r border-border/50">
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i} className="text-[11px] font-mono leading-5 text-editor-gutter">
                {i + 1}
              </span>
            ))}
          </div>
          {/* Code */}
          <pre className="flex-1 pt-3 pb-3 px-4 overflow-x-auto">
            <code className="text-[13px] font-mono leading-5">
              {tokens.map((token, i) => (
                <span key={i} className={getTokenClass(token.type)}>
                  {token.text}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </ScrollArea>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 h-7 bg-primary/10 border-t border-border text-[11px] text-muted-foreground shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Terminal className="size-3" />
            <span>Terminal</span>
          </button>
          <span className="flex items-center gap-1">
            <GitBranch className="size-3" />
            main
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>{language.toUpperCase()}</span>
          <span>UTF-8</span>
          <span>Ln {lineCount}, Col 1</span>
        </div>
      </div>

      {/* Terminal panel */}
      {showTerminal && (
        <div className="h-36 border-t border-border bg-background shrink-0">
          <div className="flex items-center justify-between px-3 h-8 bg-panel-header border-b border-border">
            <div className="flex items-center gap-2">
              <Terminal className="size-3.5 text-primary" />
              <span className="text-xs text-foreground font-medium">Terminal</span>
            </div>
            <button
              onClick={() => setShowTerminal(false)}
              className="p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close terminal"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <div className="p-2 font-mono text-xs text-muted-foreground">
            <p className="text-primary">{'>'} forge dev</p>
            <p className="text-foreground mt-1">  Ready in 1.2s</p>
            <p className="mt-0.5">  Local: http://localhost:3000</p>
            <p className="text-primary/60 mt-1 animate-pulse">{'|'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
