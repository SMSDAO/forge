import { Metadata } from "next"
import { AppShell } from "@/components/shell/app-shell"
import { SettingsPage } from "@/components/settings/settings-page"

export const metadata: Metadata = { title: "FORGES — Settings" }

export default function Settings() {
  return <AppShell><SettingsPage /></AppShell>
}
