import { Metadata } from "next"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export const metadata: Metadata = { title: "FORGES — User Management" }

export default function UsersPage() {
  return <AdminDashboard />
}
