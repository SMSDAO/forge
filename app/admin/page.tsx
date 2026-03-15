import { Metadata } from "next"
import { AppShell } from "@/components/shell/app-shell"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export const metadata: Metadata = { title: "FORGES — Admin Dashboard" }

export default function AdminPage() {
  return <AppShell><AdminDashboard /></AppShell>
}
