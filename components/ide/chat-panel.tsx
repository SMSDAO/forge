"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Paperclip,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  codeBlocks?: { language: string; code: string }[]
}

const SUGGESTION_PROMPTS = [
  "Build a todo app with drag and drop",
  "Create a responsive dashboard layout",
  "Add authentication with email login",
  "Design a landing page with hero section",
]

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px"
    }
  }, [input])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isGenerating) return
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsGenerating(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `I'll help you with that. Here's what I've generated:`,
        timestamp: new Date(),
        codeBlocks: [
          {
            language: "tsx",
            code: `export default function Component() {\n  return (\n    <div className="flex items-center justify-center min-h-screen">\n      <h1 className="text-4xl font-bold">\n        Hello World\n      </h1>\n    </div>\n  )\n}`,
          },
        ],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsGenerating(false)
    }, 1500)
  }

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border bg-panel-header shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI Assistant</span>
        </div>
        <button className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <ChevronDown className="size-4" />
        </button>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="size-6 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1 text-balance text-center">
            What do you want to build?
          </h2>
          <p className="text-sm text-muted-foreground mb-6 text-center text-pretty max-w-[280px]">
            Describe your project and I'll generate the code for you.
          </p>
          <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
            {SUGGESTION_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="text-left px-3 py-2.5 rounded-lg border border-border bg-card hover:bg-accent text-sm text-foreground transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div ref={scrollRef} className="flex flex-col gap-1 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-2 py-3",
                  message.role === "user" ? "items-end" : "items-start"
                )}
              >
                {message.role === "user" ? (
                  <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-br-md bg-primary text-primary-foreground text-sm leading-relaxed">
                    {message.content}
                  </div>
                ) : (
                  <div className="max-w-[95%] flex flex-col gap-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center mt-0.5 shrink-0">
                        <Sparkles className="size-3.5 text-primary" />
                      </div>
                      <p className="text-sm text-foreground leading-relaxed pt-0.5">
                        {message.content}
                      </p>
                    </div>
                    {message.codeBlocks?.map((block, i) => {
                      const blockId = `${message.id}-${i}`
                      return (
                        <div key={blockId} className="rounded-lg border border-border overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/50 border-b border-border">
                            <span className="text-xs font-mono text-muted-foreground">
                              {block.language}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleCopy(block.code, blockId)}
                                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {copiedId === blockId ? (
                                  <Check className="size-3.5 text-primary" />
                                ) : (
                                  <Copy className="size-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <pre className="p-3 bg-editor-bg overflow-x-auto">
                            <code className="text-xs font-mono text-foreground leading-relaxed">
                              {block.code}
                            </code>
                          </pre>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="flex items-start gap-2 py-3">
                <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center shrink-0">
                  <Sparkles className="size-3.5 text-primary animate-pulse" />
                </div>
                <div className="flex items-center gap-1 pt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {/* Input */}
      <div className="border-t border-border p-3 shrink-0">
        <div className="flex items-end gap-2 bg-secondary/40 rounded-xl border border-border px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <div className="flex items-center gap-1 pb-0.5">
            <button className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="Attach file">
              <Paperclip className="size-4" />
            </button>
            <button className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="Add image">
              <ImageIcon className="size-4" />
            </button>
          </div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground min-h-[24px] max-h-[160px] py-0.5"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className={cn(
              "p-1.5 rounded-lg transition-all shrink-0 mb-0.5",
              input.trim() && !isGenerating
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "text-muted-foreground"
            )}
            aria-label="Send message"
          >
            {isGenerating ? (
              <RotateCcw className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          AI may generate incorrect code. Always review before deploying.
        </p>
      </div>
    </div>
  )
}
