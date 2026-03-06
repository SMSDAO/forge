"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Zap,
  Rocket,
  GitBranch,
  Sparkles,
  ArrowRight,
  Check,
  Github,
  Globe,
  LayoutDashboard,
  Terminal,
  Layers,
  ChevronRight,
  Star,
  Download,
  Monitor,
  Apple,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
//  Data
// ─────────────────────────────────────────────

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Assisted Development",
    description:
      "Describe what you want to build and let the AI generate code, components, and entire project scaffolds in seconds.",
    bullets: ["Multi-model AI chat (Gemini, GPT-4o)", "Inline code suggestions", "Smart project templates"],
    color: "text-violet-400",
    glow: "shadow-[0_0_24px_oklch(0.6_0.2_310/0.15)]",
    borderHover: "hover:border-violet-500/30",
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description:
      "Every project is backed by a real GitHub repository. Commit, branch, and ship pull requests directly from the platform.",
    bullets: ["Auto-generated repositories", "Pull request workflow", "Branch protection & reviews"],
    color: "text-primary",
    glow: "shadow-[0_0_24px_oklch(0.72_0.18_200/0.15)]",
    borderHover: "hover:border-primary/30",
  },
  {
    icon: Rocket,
    title: "Instant Deployment",
    description:
      "Deploy to Vercel in one click. Get a production URL, preview deployments on every PR, and roll back in seconds.",
    bullets: ["Vercel-powered hosting", "Preview URLs on every PR", "One-click rollbacks"],
    color: "text-amber-400",
    glow: "shadow-[0_0_24px_oklch(0.7_0.15_55/0.15)]",
    borderHover: "hover:border-amber-500/30",
  },
]

const STEPS = [
  { n: "01", title: "Create a project", body: "Pick a template or describe your idea to the AI. A GitHub repo is created automatically." },
  { n: "02", title: "Build with AI", body: "Chat with the AI inside the IDE, generate code, tweak files, and see a live preview side-by-side." },
  { n: "03", title: "Open a pull request", body: "Push changes via the built-in Git panel. PRs trigger automatic CI checks and preview deployments." },
  { n: "04", title: "Ship to production", body: "Merge the PR and deploy to Vercel with one click. Your app is live in under a minute." },
]

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    highlight: false,
    features: ["1 active project", "Basic GitHub integration", "Limited deployments", "Community support"],
    cta: "Start for free",
    href: "/ide",
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    highlight: true,
    features: ["Unlimited projects", "Full GitHub automation", "Advanced deployment workflows", "Priority build queue", "Desktop application", "Priority support"],
    cta: "Upgrade to Pro",
    href: "/dashboard",
  },
]

const DESKTOP_PLATFORMS = [
  { label: "macOS", icon: Apple, ext: ".dmg" },
  { label: "Windows", icon: Monitor, ext: ".exe" },
  { label: "Linux", icon: Terminal, ext: ".AppImage" },
]

// ─────────────────────────────────────────────
//  Nav
// ─────────────────────────────────────────────

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-[0_0_10px_oklch(0.72_0.18_200/0.5)]">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">FORGES</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <a href="#features" className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            How it works
          </a>
          <a href="#pricing" className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            Pricing
          </a>
          <a href="#download" className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-1">
            <Download className="size-3" />Download
          </a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border/50"
          >
            <LayoutDashboard className="size-3.5" />Dashboard
          </Link>
          <Link
            href="/ide"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Open IDE <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1 w-4">
            <span className={cn("block h-px bg-current transition-all", mobileOpen && "rotate-45 translate-y-[5px]")} />
            <span className={cn("block h-px bg-current transition-all", mobileOpen && "opacity-0")} />
            <span className={cn("block h-px bg-current transition-all", mobileOpen && "-rotate-45 -translate-y-[5px]")} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            <a href="#features" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent">Features</a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent">How it works</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent">Pricing</a>
            <a href="#download" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent">Download</a>
            <div className="flex gap-2 pt-2 border-t border-border/40 mt-1">
              <Link href="/dashboard" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm border border-border text-foreground hover:bg-accent transition-colors">
                <LayoutDashboard className="size-4" />Dashboard
              </Link>
              <Link href="/ide" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Open IDE <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// ─────────────────────────────────────────────
//  Hero
// ─────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.72 0.18 200) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.18 200) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial glow behind headline */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-24 md:pt-32 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3.5 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="size-3" />
          AI-powered developer platform
        </div>

        {/* Headline */}
        <h1 className="mb-5 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl leading-[1.1]">
          Build.{" "}
          <span className="text-primary">Deploy.</span>{" "}
          Ship.
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
          Create and launch applications using AI, GitHub workflows, and instant cloud deployment.
        </p>

        {/* CTA strip */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/ide"
            className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_oklch(0.72_0.18_200/0.35)] hover:opacity-90 hover:shadow-[0_0_28px_oklch(0.72_0.18_200/0.5)] transition-all"
          >
            <Zap className="size-4" />
            Start building in minutes
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <LayoutDashboard className="size-4" />
            View dashboard
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-10 flex items-center justify-center gap-6 text-[11px] text-muted-foreground/60">
          <span className="flex items-center gap-1.5"><Check className="size-3 text-primary/70" />Free to start</span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1.5"><Check className="size-3 text-primary/70" />No credit card required</span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1.5"><Check className="size-3 text-primary/70" />Deploy in seconds</span>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
//  Features
// ─────────────────────────────────────────────

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Platform</p>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">Everything you need to ship</h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          FORGES brings together the tools that modern developers rely on — in one unified platform.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {FEATURES.map(f => (
          <div
            key={f.title}
            className={cn(
              "group flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 transition-all",
              f.glow,
              f.borderHover,
            )}
          >
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-accent")}>
              <f.icon className={cn("size-5", f.color)} />
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
            <ul className="flex flex-col gap-2 mt-auto">
              {f.bullets.map(b => (
                <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className={cn("size-3 shrink-0", f.color)} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
//  How it works
// ─────────────────────────────────────────────

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border/50 bg-card/50 py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Workflow</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">From idea to production in minutes</h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            FORGES removes friction at every step. No environment setup, no deployment scripts — just build and ship.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
              {/* connector line */}
              {i < STEPS.length - 1 && (
                <div className="absolute right-0 top-8 hidden translate-x-full items-center lg:flex" style={{ width: "24px" }}>
                  <div className="h-px w-6 bg-border" />
                </div>
              )}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                {step.n}
              </div>
              <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        {/* Centered CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/ide"
            className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Zap className="size-4" />
            Try it now — it&apos;s free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
//  Pricing
// ─────────────────────────────────────────────

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Pricing</p>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">Start free. Scale when ready.</h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          No hidden fees. Cancel anytime. Upgrade when your project grows.
        </p>
      </div>
      <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
        {PRICING.map(plan => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-2xl border p-7",
              plan.highlight
                ? "border-primary/40 bg-card shadow-[0_0_32px_oklch(0.72_0.18_200/0.1)]"
                : "border-border bg-card",
            )}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                  <Star className="size-3" /> Most popular
                </span>
              </div>
            )}
            <div className="mb-1 text-base font-bold text-foreground">{plan.name}</div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
              <span className="text-sm text-muted-foreground">/ {plan.period}</span>
            </div>
            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className={cn("size-3.5 shrink-0", plan.highlight ? "text-primary" : "text-muted-foreground")} />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all",
                plan.highlight
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "border border-border text-foreground hover:bg-accent",
              )}
            >
              {plan.cta}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
//  Desktop download
// ─────────────────────────────────────────────

function DesktopDownload() {
  return (
    <section id="download" className="border-t border-border/50 bg-card/30 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          <Globe className="size-3" /> Available on all platforms
        </div>
        <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">Take FORGES offline</h2>
        <p className="mb-8 text-muted-foreground max-w-sm mx-auto text-sm">
          Download the desktop app for the full FORGES experience without a browser. Available with Pro.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {DESKTOP_PLATFORMS.map(p => (
            <div
              key={p.label}
              className="group flex w-full sm:w-auto items-center gap-3 rounded-xl border border-border bg-card px-5 py-3.5 opacity-60 cursor-not-allowed select-none"
              title="Coming soon — requires Pro plan"
            >
              <p.icon className="size-5 text-muted-foreground shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{p.label}</p>
                <p className="text-[11px] text-muted-foreground">{p.ext}</p>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium ml-auto shrink-0">
                Soon
              </span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[11px] text-muted-foreground/60">
          Requires FORGES Pro. <Link href="/dashboard" className="underline hover:text-muted-foreground transition-colors">Upgrade plan</Link>
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
//  Footer
// ─────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Zap className="size-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">FORGES</span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/ide" className="hover:text-foreground transition-colors">IDE</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#download" className="hover:text-foreground transition-colors">Download</a>
          </nav>

          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} FORGES · Build fast · Ship fast · Collaborate openly
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────
//  Root component
// ─────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="h-dvh overflow-y-auto bg-background">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <DesktopDownload />
      <Footer />
    </div>
  )
}
