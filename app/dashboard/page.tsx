import { Metadata } from "next"
import { UserDashboard } from "@/components/dashboard/user-dashboard"

export const metadata: Metadata = {
  title: "FORGES — Dashboard",
  description: "Your personal FORGES dashboard with project overview, activity metrics, and usage.",
}

export default function DashboardPage() {
  return <UserDashboard />
}
