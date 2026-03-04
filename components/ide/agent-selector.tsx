"use client"

import { useState } from "react"
import { ChevronDown, Check, Users, Bot, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { AI_AGENTS, type AIAgent, getModelById } from "@/lib/ai-models"

export function AgentSelector({
  selectedAgent,
  onSelectAgent,
}: {
  selectedAgent: AIAgent
  onSelectAgent: (agent: AIAgent) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs hover:bg-accent transition-colors border border-border/50"
      >
        <div
          className="w-4 h-4 rounded-sm flex items-center justify-center text-[7px] font-bold"
          style={{ backgroundColor: selectedAgent.color + "25", color: selectedAgent.color }}
        >
          <Bot className="size-2.5" />
        </div>
        <span className="text-foreground font-medium truncate max-w-[80px]">{selectedAgent.name}</span>
        <ChevronDown className={cn("size-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-1 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI Agents</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-accent text-muted-foreground">
                <X className="size-3.5" />
              </button>
            </div>

            {/* Agent grid */}
            <div className="p-2 max-h-[360px] overflow-y-auto">
              <div className="flex flex-col gap-1">
                {AI_AGENTS.map((agent) => {
                  const model = getModelById(agent.preferredModel)
                  return (
                    <button
                      key={agent.id}
                      onClick={() => { onSelectAgent(agent); setOpen(false) }}
                      className={cn(
                        "flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg transition-all text-left w-full border",
                        selectedAgent.id === agent.id
                          ? "bg-primary/8 border-primary/20"
                          : "hover:bg-accent/50 border-transparent"
                      )}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                        style={{ backgroundColor: agent.color + "18", color: agent.color }}
                      >
                        {agent.icon}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-foreground">{agent.name}</span>
                          {selectedAgent.id === agent.id && (
                            <Check className="size-3.5 text-primary" />
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground leading-snug">{agent.description}</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {agent.capabilities.slice(0, 3).map((cap) => (
                            <span
                              key={cap}
                              className="text-[9px] px-1.5 py-0.5 rounded-md bg-secondary/60 text-muted-foreground"
                            >
                              {cap}
                            </span>
                          ))}
                          {model && (
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-md font-medium"
                              style={{ backgroundColor: model.color + "15", color: model.color }}
                            >
                              {model.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-border bg-secondary/20">
              <p className="text-[10px] text-muted-foreground">
                Each agent uses its optimal model. You can override the model in settings.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
