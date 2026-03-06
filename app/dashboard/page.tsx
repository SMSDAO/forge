import { Metadata } from "next"
import { ProjectDashboard } from "@/components/dashboard/project-dashboard"
import { actionListProjects, actionListDeployments } from "@/lib/actions"

export const metadata: Metadata = {
  title: "FORGES — Project Dashboard",
  description:
    "Manage your projects, deployments, pull requests, and team in one place.",
}

export default async function DashboardPage() {
  const [projectsResult, deploymentsResult] = await Promise.all([
    actionListProjects("user-1"),
    actionListDeployments("proj-1"),
  ])

  return (
    <ProjectDashboard
      initialProjects={projectsResult.data ?? []}
      initialDeployments={deploymentsResult.data ?? []}
    />
  )
}
