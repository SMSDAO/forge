"use client"

import { useState } from "react"
import {
  Layers,
  ChevronRight,
  Check,
  ArrowRight,
  X,
  Sparkles,
  Globe,
  ShoppingCart,
  LayoutDashboard,
  MessageSquare,
  FileText,
  Users,
  Palette,
  Database,
  Shield,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DB_CONFIGS, type DBConfig } from "@/lib/ai-models"

interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  tags: string[]
  stack: string[]
  color: string
}

const TEMPLATES: ProjectTemplate[] = [
  {
    id: "landing",
    name: "Landing Page",
    description: "Marketing landing page with hero, features, pricing, and CTA sections",
    icon: <Globe className="size-5" />,
    tags: ["marketing", "responsive"],
    stack: ["Next.js", "Tailwind", "Framer Motion"],
    color: "#06b6d4",
  },
  {
    id: "dashboard",
    name: "Admin Dashboard",
    description: "Full admin panel with charts, tables, sidebar navigation, and data management",
    icon: <LayoutDashboard className="size-5" />,
    tags: ["admin", "data"],
    stack: ["Next.js", "Recharts", "shadcn/ui"],
    color: "#3b82f6",
  },
  {
    id: "ecommerce",
    name: "E-Commerce Store",
    description: "Online store with product catalog, cart, checkout, and payment integration",
    icon: <ShoppingCart className="size-5" />,
    tags: ["store", "payments"],
    stack: ["Next.js", "Stripe", "PostgreSQL"],
    color: "#f59e0b",
  },
  {
    id: "saas",
    name: "SaaS Application",
    description: "Software-as-a-service app with auth, billing, settings, and team management",
    icon: <Users className="size-5" />,
    tags: ["auth", "billing"],
    stack: ["Next.js", "Supabase", "Stripe"],
    color: "#8b5cf6",
  },
  {
    id: "blog",
    name: "Blog / CMS",
    description: "Content management with markdown, categories, search, and SEO optimization",
    icon: <FileText className="size-5" />,
    tags: ["content", "SEO"],
    stack: ["Next.js", "MDX", "PostgreSQL"],
    color: "#ec4899",
  },
  {
    id: "chat",
    name: "AI Chat App",
    description: "Real-time chat application with AI integration and conversation history",
    icon: <MessageSquare className="size-5" />,
    tags: ["AI", "realtime"],
    stack: ["Next.js", "AI SDK", "WebSocket"],
    color: "#06b6d4",
  },
]

type BuilderStep = "template" | "database" | "features" | "style" | "review"

const STEPS: { id: BuilderStep; label: string; icon: React.ReactNode }[] = [
  { id: "template", label: "Template", icon: <Layers className="size-4" /> },
  { id: "database", label: "Database", icon: <Database className="size-4" /> },
  { id: "features", label: "Features", icon: <Zap className="size-4" /> },
  { id: "style", label: "Style", icon: <Palette className="size-4" /> },
  { id: "review", label: "Build", icon: <Sparkles className="size-4" /> },
]

const FEATURES = [
  { id: "auth", label: "Authentication", icon: <Shield className="size-3.5" />, description: "User sign-up, login, and session management" },
  { id: "payments", label: "Payments", icon: <ShoppingCart className="size-3.5" />, description: "Stripe integration for payments and subscriptions" },
  { id: "realtime", label: "Realtime", icon: <Zap className="size-3.5" />, description: "WebSocket/SSE for live updates" },
  { id: "ai", label: "AI Integration", icon: <Sparkles className="size-3.5" />, description: "AI-powered features with multiple models" },
  { id: "analytics", label: "Analytics", icon: <LayoutDashboard className="size-3.5" />, description: "Usage tracking and dashboard" },
  { id: "email", label: "Email", icon: <MessageSquare className="size-3.5" />, description: "Transactional email with Resend" },
  { id: "storage", label: "File Storage", icon: <Database className="size-3.5" />, description: "Image and file upload with Vercel Blob" },
  { id: "search", label: "Full-text Search", icon: <Globe className="size-3.5" />, description: "Search across all content" },
]

const STYLE_PRESETS = [
  { id: "minimal", label: "Minimal", description: "Clean, whitespace-focused", primary: "#18181b", accent: "#06b6d4" },
  { id: "bold", label: "Bold", description: "High contrast, strong typography", primary: "#000000", accent: "#ef4444" },
  { id: "soft", label: "Soft", description: "Rounded corners, gentle gradients", primary: "#6366f1", accent: "#f0abfc" },
  { id: "dark", label: "Dark Pro", description: "Professional dark theme", primary: "#0a0a12", accent: "#3b82f6" },
  { id: "neon", label: "Neon", description: "Vibrant neon accents on dark", primary: "#0f0f0f", accent: "#00ff88" },
  { id: "warm", label: "Warm", description: "Earth tones, comfortable feel", primary: "#faf5eb", accent: "#d97706" },
]

export function SmartBuilder({
  open,
  onClose,
  onBuild,
}: {
  open: boolean
  onClose: () => void
  onBuild: (config: {
    template: string
    database: string | null
    features: string[]
    style: string
  }) => void
}) {
  const [step, setStep] = useState<BuilderStep>("template")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedDb, setSelectedDb] = useState<string | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState("dark")
  const [isBuilding, setIsBuilding] = useState(false)

  const stepIndex = STEPS.findIndex((s) => s.id === step)

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const canProceed = () => {
    if (step === "template") return !!selectedTemplate
    return true
  }

  const nextStep = () => {
    const idx = STEPS.findIndex((s) => s.id === step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id)
  }

  const prevStep = () => {
    const idx = STEPS.findIndex((s) => s.id === step)
    if (idx > 0) setStep(STEPS[idx - 1].id)
  }

  const handleBuild = () => {
    setIsBuilding(true)
    setTimeout(() => {
      onBuild({
        template: selectedTemplate!,
        database: selectedDb,
        features: selectedFeatures,
        style: selectedStyle,
      })
      setIsBuilding(false)
      onClose()
    }, 2000)
  }

  if (!open) return null

  const template = TEMPLATES.find((t) => t.id === selectedTemplate)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Smart Builder</h2>
              <p className="text-[11px] text-muted-foreground">Configure and generate your project</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 px-5 py-2.5 border-b border-border/50 overflow-x-auto shrink-0">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  if (i <= stepIndex || (step === "review")) setStep(s.id)
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  step === s.id
                    ? "bg-primary/15 text-primary"
                    : i < stepIndex
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {i < stepIndex ? (
                  <Check className="size-3.5 text-primary" />
                ) : (
                  s.icon
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="size-3 text-muted-foreground/40 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5">
          {step === "template" && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Choose a starter template</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-xl border transition-all text-left",
                      selectedTemplate === t.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:border-border hover:bg-accent/30"
                    )}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: t.color + "18", color: t.color }}
                    >
                      {t.icon}
                    </div>
                    <div className="flex flex-col min-w-0 gap-1">
                      <span className="text-sm font-medium text-foreground">{t.name}</span>
                      <span className="text-[11px] text-muted-foreground leading-snug">{t.description}</span>
                      <div className="flex items-center gap-1 flex-wrap mt-0.5">
                        {t.stack.map((s) => (
                          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedTemplate === t.id && (
                      <Check className="size-4 text-primary shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "database" && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-1">Select a database</h3>
              <p className="text-[11px] text-muted-foreground mb-3">Auto-configured with connection strings and migrations</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedDb(null)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                    selectedDb === null
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:bg-accent/30"
                  )}
                >
                  <div className="w-9 h-9 rounded-lg bg-secondary/60 flex items-center justify-center text-muted-foreground shrink-0">
                    <X className="size-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">No Database</span>
                    <p className="text-[10px] text-muted-foreground">Static site, no backend</p>
                  </div>
                </button>
                {DB_CONFIGS.map((db) => (
                  <button
                    key={db.id}
                    onClick={() => setSelectedDb(db.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      selectedDb === db.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:bg-accent/30"
                    )}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ backgroundColor: db.color + "18", color: db.color }}
                    >
                      {db.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground">{db.name}</span>
                        {db.autoSetup && (
                          <span className="text-[8px] px-1 py-0.5 rounded bg-primary/15 text-primary font-semibold">AUTO</span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{db.description}</p>
                    </div>
                    {selectedDb === db.id && <Check className="size-4 text-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "features" && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-1">Add features</h3>
              <p className="text-[11px] text-muted-foreground mb-3">Select the features you need. All are pre-configured.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FEATURES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => toggleFeature(f.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      selectedFeatures.includes(f.id)
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:bg-accent/30"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      selectedFeatures.includes(f.id) ? "bg-primary/15 text-primary" : "bg-secondary/60 text-muted-foreground"
                    )}>
                      {f.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-foreground">{f.label}</span>
                      <p className="text-[10px] text-muted-foreground">{f.description}</p>
                    </div>
                    <div className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                      selectedFeatures.includes(f.id) ? "bg-primary border-primary" : "border-muted-foreground/30"
                    )}>
                      {selectedFeatures.includes(f.id) && <Check className="size-2.5 text-primary-foreground" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "style" && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-1">Pick a style</h3>
              <p className="text-[11px] text-muted-foreground mb-3">Choose the visual direction for your project</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STYLE_PRESETS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                      selectedStyle === s.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:bg-accent/30"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full border border-border/50" style={{ backgroundColor: s.primary }} />
                      <div className="w-6 h-6 rounded-full border border-border/50" style={{ backgroundColor: s.accent }} />
                    </div>
                    <span className="text-xs font-medium text-foreground">{s.label}</span>
                    <span className="text-[10px] text-muted-foreground text-center">{s.description}</span>
                    {selectedStyle === s.id && <Check className="size-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "review" && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Review your project</h3>
              <div className="flex flex-col gap-3">
                {template && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: template.color + "18", color: template.color }}
                    >
                      {template.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{template.name}</p>
                      <p className="text-[10px] text-muted-foreground">Template</p>
                    </div>
                  </div>
                )}
                {selectedDb && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
                    <Database className="size-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{DB_CONFIGS.find(d => d.id === selectedDb)?.name}</p>
                      <p className="text-[10px] text-muted-foreground">Database (auto-configured)</p>
                    </div>
                  </div>
                )}
                {selectedFeatures.length > 0 && (
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                    <p className="text-xs font-medium text-foreground mb-2">Features ({selectedFeatures.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFeatures.map((f) => {
                        const feat = FEATURES.find((x) => x.id === f)
                        return (
                          <span key={f} className="text-[10px] px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                            {feat?.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
                  <Palette className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{STYLE_PRESETS.find(s => s.id === selectedStyle)?.label}</p>
                    <p className="text-[10px] text-muted-foreground">Style preset</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
          <button
            onClick={stepIndex > 0 ? prevStep : onClose}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors"
          >
            {stepIndex > 0 ? "Back" : "Cancel"}
          </button>
          {step === "review" ? (
            <button
              onClick={handleBuild}
              disabled={isBuilding}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all",
                isBuilding
                  ? "bg-primary/50 text-primary-foreground cursor-wait"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              )}
            >
              {isBuilding ? (
                <>
                  <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Building...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  Generate Project
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all",
                canProceed()
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Next
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
