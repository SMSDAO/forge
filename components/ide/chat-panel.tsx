"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Paperclip,
  Image as ImageIcon,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Play,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Plus,
  Globe,
  Wand2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ModelSelector } from "./model-selector"
import { AgentSelector } from "./agent-selector"
import {
  AI_MODELS,
  AI_AGENTS,
  type AIModel,
  type AIAgent,
  getProviderLabel,
} from "@/lib/ai-models"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  codeBlocks?: { language: string; code: string; filename?: string }[]
  agent?: AIAgent
  model?: AIModel
  thinking?: boolean
}

interface ChatThread {
  id: string
  title: string
  messages: Message[]
  agent: AIAgent
  model: AIModel
  createdAt: Date
}

const SUGGESTION_PROMPTS = [
  { text: "Build a todo app with drag and drop", icon: <Wand2 className="size-3.5" /> },
  { text: "Create a responsive dashboard layout", icon: <Globe className="size-3.5" /> },
  { text: "Add authentication with email login", icon: <Sparkles className="size-3.5" /> },
  { text: "Design a landing page with animations", icon: <Wand2 className="size-3.5" /> },
  { text: "Generate a REST API with CRUD endpoints", icon: <Play className="size-3.5" /> },
  { text: "Create a Stripe payment checkout flow", icon: <Globe className="size-3.5" /> },
]

const SAMPLE_RESPONSES: Record<string, { content: string; code: string; language: string; filename: string }> = {
  default: {
    content: "I'll generate that for you. Here's a clean implementation with TypeScript and Tailwind CSS:",
    code: `import { useState } from "react"\nimport { Button } from "@/components/ui/button"\n\nexport function TodoApp() {\n  const [todos, setTodos] = useState<string[]>([])\n  const [input, setInput] = useState("")\n\n  const addTodo = () => {\n    if (input.trim()) {\n      setTodos(prev => [...prev, input.trim()])\n      setInput("")\n    }\n  }\n\n  return (\n    <div className="max-w-md mx-auto p-6">\n      <h1 className="text-2xl font-bold mb-4">Todo App</h1>\n      <div className="flex gap-2 mb-4">\n        <input\n          value={input}\n          onChange={e => setInput(e.target.value)}\n          placeholder="Add a task..."\n          className="flex-1 px-3 py-2 border rounded-lg"\n        />\n        <Button onClick={addTodo}>Add</Button>\n      </div>\n      <ul className="space-y-2">\n        {todos.map((todo, i) => (\n          <li key={i} className="p-3 bg-card rounded-lg border">\n            {todo}\n          </li>\n        ))}\n      </ul>\n    </div>\n  )\n}`,
    language: "tsx",
    filename: "todo-app.tsx",
  },
}

export function ChatPanel() {
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[3]) // Gemini 2.0 Flash
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(AI_AGENTS[0]) // Forge Coder
  const [showThreads, setShowThreads] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeThread = threads.find((t) => t.id === activeThreadId)
  const messages = activeThread?.messages ?? []

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + "px"
    }
  }, [input])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const createThread = useCallback((firstMessage: string) => {
    const thread: ChatThread = {
      id: crypto.randomUUID(),
      title: firstMessage.slice(0, 40) + (firstMessage.length > 40 ? "..." : ""),
      messages: [],
      agent: selectedAgent,
      model: selectedModel,
      createdAt: new Date(),
    }
    setThreads((prev) => [thread, ...prev])
    setActiveThreadId(thread.id)
    return thread.id
  }, [selectedAgent, selectedModel])

  const handleSend = useCallback(() => {
    if (!input.trim() || isGenerating) return
    const text = input.trim()
    setInput("")

    let threadId = activeThreadId
    if (!threadId) {
      threadId = createThread(text)
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, messages: [...t.messages, userMessage] } : t
      )
    )
    setIsGenerating(true)

    // Add thinking indicator
    const thinkingId = crypto.randomUUID()
    setTimeout(() => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: [
                  ...t.messages.filter((m) => m.id !== thinkingId),
                  {
                    id: thinkingId,
                    role: "assistant" as const,
                    content: "",
                    timestamp: new Date(),
                    thinking: true,
                    agent: selectedAgent,
                    model: selectedModel,
                  },
                ],
              }
            : t
        )
      )
    }, 200)

    // Simulate AI response
    setTimeout(() => {
      const resp = SAMPLE_RESPONSES.default
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: resp.content,
        timestamp: new Date(),
        agent: selectedAgent,
        model: selectedModel,
        codeBlocks: [
          {
            language: resp.language,
            code: resp.code,
            filename: resp.filename,
          },
        ],
      }
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: [...t.messages.filter((m) => !m.thinking), assistantMessage],
              }
            : t
        )
      )
      setIsGenerating(false)
    }, 2200)
  }, [input, isGenerating, activeThreadId, createThread, selectedAgent, selectedModel])

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

  const handleNewChat = () => {
    setActiveThreadId(null)
    setShowThreads(false)
  }

  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setThreads((prev) => prev.filter((t) => t.id !== id))
    if (activeThreadId === id) setActiveThreadId(null)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-11 border-b border-border bg-panel-header shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setShowThreads(!showThreads)}
            className="flex items-center gap-1.5 px-1.5 py-1 rounded-md hover:bg-accent transition-colors"
          >
            <Sparkles className="size-4 text-primary shrink-0" />
            <span className="text-xs font-semibold text-foreground truncate max-w-[80px]">
              {activeThread ? activeThread.title : "New Chat"}
            </span>
            <ChevronDown className={cn("size-3 text-muted-foreground transition-transform", showThreads && "rotate-180")} />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleNewChat}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="New chat"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Thread list overlay */}
      {showThreads && (
        <div className="border-b border-border bg-card">
          <div className="p-2 max-h-[200px] overflow-y-auto">
            {threads.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3">No conversations yet</p>
            ) : (
              <div className="flex flex-col gap-0.5">
                {threads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveThreadId(t.id); setShowThreads(false) }}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors group w-full",
                      activeThreadId === t.id ? "bg-accent" : "hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className="w-5 h-5 rounded-sm flex items-center justify-center text-[8px] font-bold shrink-0"
                        style={{ backgroundColor: t.agent.color + "25", color: t.agent.color }}
                      >
                        <Bot className="size-3" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{t.title}</p>
                        <p className="text-[9px] text-muted-foreground">
                          {t.messages.length} messages &middot; {t.agent.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteThread(t.id, e)}
                      className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      aria-label="Delete thread"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages or empty state */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <Sparkles className="size-7 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1 text-balance text-center">
            What do you want to build?
          </h2>
          <p className="text-sm text-muted-foreground mb-5 text-center text-pretty max-w-[260px]">
            Choose an AI agent and model, then describe your project.
          </p>

          {/* Agent/Model quick info */}
          <div className="flex items-center gap-2 mb-5 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border/50">
              <div
                className="w-4 h-4 rounded-sm flex items-center justify-center text-[7px] font-bold"
                style={{ backgroundColor: selectedAgent.color + "25", color: selectedAgent.color }}
              >
                <Bot className="size-2.5" />
              </div>
              <span className="text-[11px] text-foreground font-medium">{selectedAgent.name}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border/50">
              <div
                className="w-4 h-4 rounded-sm flex items-center justify-center text-[7px] font-bold"
                style={{ backgroundColor: selectedModel.color + "25", color: selectedModel.color }}
              >
                {selectedModel.icon}
              </div>
              <span className="text-[11px] text-foreground font-medium">{selectedModel.name}</span>
              {selectedModel.free && (
                <span className="text-[8px] font-bold text-primary">FREE</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1.5 w-full max-w-sm">
            {SUGGESTION_PROMPTS.map((prompt) => (
              <button
                key={prompt.text}
                onClick={() => setInput(prompt.text)}
                className="flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl border border-border bg-card hover:bg-accent/50 text-sm text-foreground transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-secondary/60 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                  {prompt.icon}
                </div>
                <span className="truncate">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div ref={scrollRef} className="flex flex-col gap-0.5 p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-2 py-3",
                  message.role === "user" ? "items-end" : "items-start"
                )}
              >
                {message.thinking ? (
                  <div className="flex items-start gap-2.5 max-w-[95%]">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0"
                      style={{ backgroundColor: (message.agent?.color ?? "#64748b") + "18", color: message.agent?.color ?? "#64748b" }}
                    >
                      <Bot className="size-3.5" />
                    </div>
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-foreground">{message.agent?.name ?? "AI"}</span>
                        <span className="text-[9px] text-muted-foreground">is thinking...</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        {message.model && (
                          <span
                            className="text-[8px] px-1 py-0.5 rounded font-medium"
                            style={{ backgroundColor: message.model.color + "15", color: message.model.color }}
                          >
                            {message.model.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : message.role === "user" ? (
                  <div className="max-w-[85%] flex flex-col items-end gap-1">
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-br-md bg-primary text-primary-foreground text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <span className="text-[9px] text-muted-foreground px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ) : (
                  <div className="max-w-[95%] flex flex-col gap-2.5">
                    {/* Agent header */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{ backgroundColor: (message.agent?.color ?? "#64748b") + "18", color: message.agent?.color ?? "#64748b" }}
                      >
                        <Bot className="size-3.5" />
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-foreground">{message.agent?.name ?? "AI"}</span>
                        {message.model && (
                          <span
                            className="text-[8px] px-1.5 py-0.5 rounded-md font-medium"
                            style={{ backgroundColor: message.model.color + "12", color: message.model.color }}
                          >
                            {message.model.name}
                          </span>
                        )}
                        <span className="text-[9px] text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pl-9">
                      <p className="text-sm text-foreground leading-relaxed">{message.content}</p>

                      {/* Code blocks */}
                      {message.codeBlocks?.map((block, i) => {
                        const blockId = `${message.id}-${i}`
                        return (
                          <div key={blockId} className="rounded-xl border border-border overflow-hidden mt-3">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/40 border-b border-border">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-muted-foreground">{block.filename ?? block.language}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-primary hover:bg-primary/10 transition-colors"
                                >
                                  <Play className="size-3" />
                                  Apply
                                </button>
                                <button
                                  onClick={() => handleCopy(block.code, blockId)}
                                  className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {copiedId === blockId ? (
                                    <Check className="size-3 text-primary" />
                                  ) : (
                                    <Copy className="size-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <pre className="p-3 bg-editor-bg overflow-x-auto">
                              <code className="text-[12px] font-mono text-foreground/90 leading-5">
                                {block.code}
                              </code>
                            </pre>
                          </div>
                        )
                      })}

                      {/* Feedback */}
                      <div className="flex items-center gap-1 mt-2.5">
                        <button className="p-1 rounded hover:bg-accent text-muted-foreground/50 hover:text-foreground transition-colors" aria-label="Thumbs up">
                          <ThumbsUp className="size-3" />
                        </button>
                        <button className="p-1 rounded hover:bg-accent text-muted-foreground/50 hover:text-foreground transition-colors" aria-label="Thumbs down">
                          <ThumbsDown className="size-3" />
                        </button>
                        <button className="p-1 rounded hover:bg-accent text-muted-foreground/50 hover:text-foreground transition-colors" aria-label="Retry">
                          <RotateCcw className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Input area */}
      <div className="border-t border-border p-2.5 shrink-0">
        {/* Agent / Model selectors */}
        <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-0.5">
          <AgentSelector selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} />
          <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} compact />
        </div>

        {/* Input box */}
        <div className="flex items-end gap-2 bg-secondary/30 rounded-xl border border-border px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <div className="flex items-center gap-0.5 pb-0.5">
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
            placeholder={`Ask ${selectedAgent.name}...`}
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground min-h-[24px] max-h-[140px] py-0.5"
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
        <p className="text-[9px] text-muted-foreground text-center mt-1.5">
          {selectedAgent.name} powered by {selectedModel.name} ({getProviderLabel(selectedModel.provider)})
          {selectedModel.free && " - Free"}
        </p>
      </div>
    </div>
  )
}
