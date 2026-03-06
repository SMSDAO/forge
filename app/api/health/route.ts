import { NextResponse } from "next/server"

export interface HealthResponse {
  status: "ok"
  version: string
  timestamp: string
}

export async function GET() {
  const response: HealthResponse = {
    status: "ok",
    version: process.env.npm_package_version ?? "0.1.0",
    timestamp: new Date().toISOString(),
  }
  return NextResponse.json(response)
}
