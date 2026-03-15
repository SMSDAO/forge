"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Activity,
  Bell,
  CheckCircle2,
  Clock,
  Code2,
  CreditCard,
  Globe,
  Rocket,
  Settings,
  TrendingUp,
  Zap,
} from "lucide-react"
import Link from "next/link"

const activityData = [
  { day: "Mon", deployments: 2, api: 145 },
  { day: "Tue", deployments: 5, api: 280 },
  { day: "Wed", deployments: 3, api: 190 },
  { day: "Thu", deployments: 8, api: 420 },
  { day: "Fri", deployments: 4, api: 310 },
  { day: "Sat", deployments: 1, api: 95 },
  { day: "Sun", deployments: 2, api: 130 },
]

const notifications = [
  { id: "1", type: "success", message: "Deployment to production succeeded", time: "5m ago" },
  { id: "2", type: "info", message: "New team member invited: alice@company.com", time: "1h ago" },
  { id: "3", type: "warning", message: "API usage at 82% of monthly limit", time: "3h ago" },
  { id: "4", type: "success", message: "SSL certificate renewed automatically", time: "1d ago" },
]

const usageMetrics = [
  { name: "API Calls", used: 8200, limit: 10000, unit: "calls" },
  { name: "Storage", used: 3.2, limit: 10, unit: "GB" },
  { name: "Bandwidth", used: 45, limit: 100, unit: "GB" },
  { name: "Build Minutes", used: 320, limit: 500, unit: "min" },
]

export function UserDashboard() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, User</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your projects.</p>
        </div>
        <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
          Free Plan
        </Badge>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Projects", value: "4", icon: Code2, delta: "+1 this week" },
          { label: "Deployments", value: "25", icon: Rocket, delta: "+8 this week" },
          { label: "API Calls", value: "8.2K", icon: Zap, delta: "82% of limit" },
          { label: "Uptime", value: "99.9%", icon: Globe, delta: "Last 30 days" },
        ].map(stat => (
          <Card key={stat.label} className="border-border/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.delta}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              Activity Overview
            </CardTitle>
            <CardDescription>Deployments and API calls over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDeploy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "8px" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Area type="monotone" dataKey="api" stroke="#22d3ee" fill="url(#colorApi)" strokeWidth={2} name="API Calls" />
                <Area type="monotone" dataKey="deployments" stroke="#818cf8" fill="url(#colorDeploy)" strokeWidth={2} name="Deployments" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-cyan-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="flex gap-3 items-start">
                <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                  n.type === "success" ? "bg-green-400" :
                  n.type === "warning" ? "bg-amber-400" : "bg-cyan-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground">
              View all notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Metered usage */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              Metered Usage
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Current billing cycle</Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings#billing">
                  <CreditCard className="h-3.5 w-3.5 mr-1" />
                  Upgrade
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {usageMetrics.map(m => {
              const pct = Math.round((m.used / m.limit) * 100)
              return (
                <div key={m.name} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>{m.name}</span>
                    <span className={`font-medium ${pct > 80 ? "text-amber-400" : "text-muted-foreground"}`}>
                      {m.used} / {m.limit} {m.unit}
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    className={`h-2 ${pct > 80 ? "[&>div]:bg-amber-400" : "[&>div]:bg-cyan-400"}`}
                  />
                  <p className="text-xs text-muted-foreground">{pct}% used</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/ide">
            <Code2 className="h-4 w-4 mr-2" />
            Open IDE
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/docs">
            <Globe className="h-4 w-4 mr-2" />
            Documentation
          </Link>
        </Button>
      </div>
    </div>
  )
}
