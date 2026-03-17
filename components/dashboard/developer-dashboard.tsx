"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Activity,
  AlertCircle,
  Clock,
  Code2,
  Play,
  RefreshCw,
  Server,
  Terminal,
  Zap,
  GitBranch,
  Package,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const latencyData = [
  { time: "14:00", p50: 45, p95: 120, p99: 280 },
  { time: "14:10", p50: 52, p95: 135, p99: 310 },
  { time: "14:20", p50: 41, p95: 110, p99: 245 },
  { time: "14:30", p50: 67, p95: 180, p99: 420 },
  { time: "14:40", p50: 49, p95: 128, p99: 295 },
  { time: "14:50", p50: 44, p95: 115, p99: 260 },
]

const logLines = [
  { level: "INFO", time: "14:53:01", msg: "Server started on port 3000" },
  { level: "INFO", time: "14:53:02", msg: "Database connection established" },
  { level: "INFO", time: "14:53:05", msg: "GET /api/health 200 12ms" },
  { level: "WARN", time: "14:53:18", msg: "Rate limit approaching for user-42" },
  { level: "INFO", time: "14:53:22", msg: "POST /api/deploy 201 345ms" },
  { level: "ERROR", time: "14:53:45", msg: "Failed to connect to cache: ECONNREFUSED" },
  { level: "INFO", time: "14:53:46", msg: "Retrying cache connection (attempt 1/3)" },
  { level: "INFO", time: "14:53:47", msg: "Cache connection restored" },
  { level: "INFO", time: "14:54:01", msg: "GET /api/projects 200 28ms" },
  { level: "INFO", time: "14:54:15", msg: "Deployment pipeline triggered: proj-1" },
]

const envVars = [
  { key: "DATABASE_URL", value: "postgres://***@db.example.com/forge", secret: true },
  { key: "NEXT_PUBLIC_APP_URL", value: "https://forge.example.com", secret: false },
  { key: "AUTH_SECRET", value: "••••••••••••••••", secret: true },
  { key: "OPENAI_API_KEY", value: "sk-••••••••••••••••", secret: true },
  { key: "NODE_ENV", value: "production", secret: false },
]

const deployments = [
  { id: "dep-1", branch: "main", status: "success", duration: "2m 14s", time: "10 min ago", commit: "a1b2c3d" },
  { id: "dep-2", branch: "feature/auth", status: "building", duration: "—", time: "2 min ago", commit: "e4f5g6h" },
  { id: "dep-3", branch: "hotfix/login", status: "failed", duration: "0m 45s", time: "1 hour ago", commit: "i7j8k9l" },
  { id: "dep-4", branch: "main", status: "success", duration: "1m 58s", time: "3 hours ago", commit: "m0n1o2p" },
]

const statusColors: Record<string, string> = {
  success: "text-green-400 border-green-400/50",
  building: "text-amber-400 border-amber-400/50",
  failed: "text-red-400 border-red-400/50",
}

export function DeveloperDashboard() {
  const [testInput, setTestInput] = useState('{"userId": "user-1"}')
  const [testResult, setTestResult] = useState("")
  const [testLoading, setTestLoading] = useState(false)

  async function runTest() {
    setTestLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setTestResult(JSON.stringify({ success: true, data: { id: "user-1", name: "Alice Chen", role: "admin" }, latency: "42ms" }, null, 2))
    setTestLoading(false)
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Code2 className="h-6 w-6 text-cyan-400" />
            Developer Dashboard
          </h1>
          <p className="text-muted-foreground">API monitoring, logs, and deployment diagnostics</p>
        </div>
        <Badge className="bg-indigo-400/10 text-indigo-400 border-indigo-400/50">Developer Access</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Latency", value: "49ms", icon: Zap, color: "text-cyan-400" },
          { label: "Error Rate", value: "0.12%", icon: AlertCircle, color: "text-green-400" },
          { label: "Requests/min", value: "342", icon: Activity, color: "text-indigo-400" },
          { label: "Active Builds", value: "1", icon: Package, color: "text-amber-400" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="api">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:flex">
          <TabsTrigger value="api">API Monitor</TabsTrigger>
          <TabsTrigger value="logs">Log Viewer</TabsTrigger>
          <TabsTrigger value="env">Environment</TabsTrigger>
          <TabsTrigger value="deploy">Deployments</TabsTrigger>
        </TabsList>

        {/* API Monitor */}
        <TabsContent value="api" className="space-y-4 mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Response Latency Percentiles</CardTitle>
              <CardDescription>p50, p95, p99 over last 60 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} unit="ms" />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "8px" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Line type="monotone" dataKey="p50" stroke="#22d3ee" strokeWidth={2} dot={false} name="p50" />
                  <Line type="monotone" dataKey="p95" stroke="#818cf8" strokeWidth={2} dot={false} name="p95" />
                  <Line type="monotone" dataKey="p99" stroke="#f87171" strokeWidth={2} dot={false} name="p99" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Integration test console */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                Integration Test Console
              </CardTitle>
              <CardDescription>Send test requests to /api/health endpoint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  className="font-mono text-xs"
                  value={testInput}
                  onChange={e => setTestInput(e.target.value)}
                  placeholder='{"userId": "user-1"}'
                />
                <Button size="sm" onClick={runTest} disabled={testLoading}>
                  <Play className="h-3.5 w-3.5 mr-1" />
                  {testLoading ? "Running…" : "Run"}
                </Button>
              </div>
              {testResult && (
                <pre className="bg-black/40 rounded-md p-3 text-xs font-mono text-green-400 overflow-auto max-h-32">
                  {testResult}
                </pre>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Log Viewer */}
        <TabsContent value="logs" className="mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  Application Logs
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-80">
                <div className="p-3 font-mono text-xs space-y-1">
                  {logLines.map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-muted-foreground shrink-0">{line.time}</span>
                      <span className={`shrink-0 font-semibold ${
                        line.level === "ERROR" ? "text-red-400" :
                        line.level === "WARN" ? "text-amber-400" : "text-cyan-400"
                      }`}>{line.level}</span>
                      <span className="text-slate-300">{line.msg}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Environment */}
        <TabsContent value="env" className="mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Environment Variables</CardTitle>
              <CardDescription>Current environment configuration (secrets masked)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {envVars.map(v => (
                  <div key={v.key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <code className="text-xs font-mono text-cyan-400">{v.key}</code>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-muted-foreground max-w-[200px] truncate">{v.value}</code>
                      {v.secret && (
                        <Badge variant="outline" className="text-[10px] border-amber-400/50 text-amber-400">secret</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployments */}
        <TabsContent value="deploy" className="mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Server className="h-4 w-4 text-cyan-400" />
                Deployment Diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deployments.map(dep => (
                  <div key={dep.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium truncate">{dep.branch}</span>
                        <code className="text-xs text-muted-foreground font-mono">{dep.commit}</code>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{dep.time} · {dep.duration}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize shrink-0 ${statusColors[dep.status] ?? ""}`}>
                      {dep.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
