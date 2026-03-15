import { Metadata } from "next"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export const metadata: Metadata = { title: "FORGES — Admin Dashboard" }

export default function AdminPage() {
  return <AdminDashboard />
}
