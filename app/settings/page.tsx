import { Metadata } from "next"
import { SettingsPage } from "@/components/settings/settings-page"

export const metadata: Metadata = { title: "FORGES — Settings" }

export default function Settings() {
  return <SettingsPage />
}
