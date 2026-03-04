"use client"

import { useState, useMemo } from "react"
import {
  ChevronDown,
  Zap,
  Crown,
  Search,
  Check,
  Sparkles,
  X,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AI_MODELS,
  type AIModel,
  type ModelProvider,
  getProviderLabel,
} from "@/lib/ai-models"

const PROVIDERS: { id: ModelProvider | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "openai", label: "OpenAI" },
  { id: "google", label: "Google" },
  { id: "anthropic", label: "Anthropic" },
  { id: "meta", label: "Meta" },
  { id: "microsoft", label: "Microsoft" },
  { id: "mistral", label: "Mistral" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "cohere", label: "Cohere" },
]

function SpeedDots({ speed }: { speed: AIModel["speed"] }) {
  const count = speed === "fast" ? 3 : speed === "medium" ? 2 : 1
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "w-1 h-1 rounded-full",
            i <= count ? "bg-primary" : "bg-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

export function ModelSelector({
  selectedModel,
  onSelectModel,
  compact = false,
}: {
  selectedModel: AIModel
  onSelectModel: (model: AIModel) => void
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filterProvider, setFilterProvider] = useState<ModelProvider | "all">("all")
  const [showFreeOnly, setShowFreeOnly] = useState(false)

  const filtered = useMemo(() => {
    return AI_MODELS.filter((m) => {
      if (filterProvider !== "all" && m.provider !== filterProvider) return false
      if (showFreeOnly && !m.free) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [filterProvider, showFreeOnly, search])

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs hover:bg-accent transition-colors border border-border/50"
        >
          <div
            className="w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: selectedModel.color + "25", color: selectedModel.color }}
          >
            {selectedModel.icon}
          </div>
          <span className="text-foreground font-medium truncate max-w-[100px]">{selectedModel.name}</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute top-full left-0 mt-1 w-72 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
              <CompactModelList
                models={AI_MODELS}
                selected={selectedModel}
                onSelect={(m) => { onSelectModel(m); setOpen(false) }}
              />
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/60 transition-colors w-full border border-border/50 bg-secondary/30"
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
          style={{ backgroundColor: selectedModel.color + "20", color: selectedModel.color }}
        >
          {selectedModel.icon}
        </div>
        <div className="flex flex-col items-start min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-foreground truncate">{selectedModel.name}</span>
            {selectedModel.free && (
              <span className="px-1 py-0.5 rounded text-[9px] font-semibold bg-primary/15 text-primary">FREE</span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground truncate w-full text-left">
            {getProviderLabel(selectedModel.provider)} &middot; {selectedModel.contextWindow}
          </span>
        </div>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-1 w-full min-w-[320px] max-h-[420px] bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-2.5 py-2 border border-border/50">
                <Search className="size-3.5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search models..."
                  className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
                  autoFocus
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-border overflow-x-auto">
              <button
                onClick={() => setShowFreeOnly(!showFreeOnly)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium shrink-0 transition-colors border",
                  showFreeOnly
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "text-muted-foreground border-border/50 hover:bg-accent"
                )}
              >
                <Zap className="size-3" />
                Free
              </button>
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFilterProvider(p.id)}
                  className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-medium shrink-0 transition-colors border",
                    filterProvider === p.id
                      ? "bg-accent text-foreground border-border"
                      : "text-muted-foreground border-transparent hover:bg-accent/50"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Model list */}
            <div className="flex-1 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-muted-foreground">
                  <Filter className="size-5 mb-2" />
                  <p className="text-xs">No models match your filters</p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {filtered.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => { onSelectModel(model); setOpen(false) }}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-left w-full",
                        selectedModel.id === model.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-accent/60 border border-transparent"
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: model.color + "18", color: model.color }}
                      >
                        {model.icon}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-foreground truncate">{model.name}</span>
                          {model.free && (
                            <span className="px-1 py-0.5 rounded text-[8px] font-bold bg-primary/15 text-primary">FREE</span>
                          )}
                          {model.quality === "premium" && !model.free && (
                            <Crown className="size-3 text-amber-400" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground truncate">
                          {model.description}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] text-muted-foreground/70">{model.contextWindow}</span>
                          <SpeedDots speed={model.speed} />
                          {model.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[9px] px-1 py-0.5 rounded bg-secondary/60 text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedModel.id === model.id && (
                        <Check className="size-4 text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function CompactModelList({
  models,
  selected,
  onSelect,
}: {
  models: AIModel[]
  selected: AIModel
  onSelect: (model: AIModel) => void
}) {
  const [search, setSearch] = useState("")
  const filtered = models.filter((m) => {
    if (!search) return true
    return m.name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="flex flex-col max-h-[300px]">
      <div className="p-2 border-b border-border">
        <div className="flex items-center gap-1.5 bg-secondary/50 rounded-md px-2 py-1.5">
          <Search className="size-3 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground w-full"
            autoFocus
          />
        </div>
      </div>
      <div className="overflow-y-auto p-1">
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m)}
            className={cn(
              "flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-left transition-colors",
              selected.id === m.id ? "bg-primary/10" : "hover:bg-accent/50"
            )}
          >
            <div
              className="w-5 h-5 rounded-sm flex items-center justify-center text-[9px] font-bold shrink-0"
              style={{ backgroundColor: m.color + "20", color: m.color }}
            >
              {m.icon}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium text-foreground truncate">{m.name}</span>
              <span className="text-[9px] text-muted-foreground truncate">{getProviderLabel(m.provider)}</span>
            </div>
            {m.free && <span className="text-[8px] font-bold text-primary">FREE</span>}
            {selected.id === m.id && <Check className="size-3 text-primary" />}
          </button>
        ))}
      </div>
    </div>
  )
}
