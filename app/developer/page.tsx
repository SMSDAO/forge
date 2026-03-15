import { Metadata } from "next"
import { AppShell } from "@/components/shell/app-shell"
import { DeveloperDashboard } from "@/components/dashboard/developer-dashboard"

export const metadata: Metadata = { title: "FORGES — Developer Dashboard" }

export default function DeveloperPage() {
  return <AppShell><DeveloperDashboard /></AppShell>
}
