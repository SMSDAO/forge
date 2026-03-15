import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "FORGES — Documentation" }

const sections = [
  {
    title: "Getting Started",
    links: [
      { href: "/docs/architecture", label: "Architecture Overview" },
      { href: "/docs/deployment", label: "Deployment Guide" },
      { href: "/docs/env-vars", label: "Environment Variables" },
    ],
  },
  {
    title: "User Guides",
    links: [
      { href: "/docs/user-guide", label: "User Guide" },
      { href: "/docs/admin-guide", label: "Admin Guide" },
      { href: "/docs/developer-guide", label: "Developer Guide" },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Documentation
        </h1>
        <p className="text-muted-foreground mt-2">
          Everything you need to build, deploy, and manage with FORGES.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(section => (
          <div key={section.title} className="rounded-lg border border-border/50 p-5 space-y-3 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] transition-shadow">
            <h2 className="font-semibold text-cyan-400">{section.title}</h2>
            <ul className="space-y-2">
              {section.links.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border/50 p-5">
        <h2 className="font-semibold text-cyan-400 mb-3">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "GitHub Repository", href: "https://github.com/SMSDAO/forge" },
            { label: "CHANGELOG", href: "/CHANGELOG.md" },
            { label: "Health Check", href: "/api/health" },
          ].map(l => (
            <a key={l.href} href={l.href} className="text-sm text-primary hover:underline">{l.label}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
