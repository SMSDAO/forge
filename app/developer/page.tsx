import { Metadata } from "next"
import { DeveloperDashboard } from "@/components/dashboard/developer-dashboard"

export const metadata: Metadata = { title: "FORGES — Developer Dashboard" }

export default function DeveloperPage() {
  return <DeveloperDashboard />
}
