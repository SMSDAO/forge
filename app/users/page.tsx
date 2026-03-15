import { Metadata } from "next"
import { AppShell } from "@/components/shell/app-shell"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export const metadata: Metadata = { title: "FORGES — User Management" }

export default function UsersPage() {
  return <AppShell><AdminDashboard /></AppShell>
}
