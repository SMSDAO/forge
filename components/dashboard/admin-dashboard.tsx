"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Shield,
  Users,
  Server,
  Settings,
  Search,
  UserPlus,
  MoreHorizontal,
  TrendingUp,
  Zap,
} from "lucide-react"

const mockUsers = [
  { id: "1", name: "Alice Chen", email: "alice@example.com", role: "admin", status: "active", joined: "2024-01-15" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "developer", status: "active", joined: "2024-02-20" },
  { id: "3", name: "Carol Davis", email: "carol@example.com", role: "user", status: "active", joined: "2024-03-10" },
  { id: "4", name: "Dave Wilson", email: "dave@example.com", role: "auditor", status: "inactive", joined: "2024-04-05" },
  { id: "5", name: "Eve Martinez", email: "eve@example.com", role: "developer", status: "active", joined: "2024-05-12" },
]

const apiData = [
  { hour: "00:00", requests: 120 },
  { hour: "04:00", requests: 45 },
  { hour: "08:00", requests: 380 },
  { hour: "12:00", requests: 620 },
  { hour: "16:00", requests: 540 },
  { hour: "20:00", requests: 290 },
]

const auditLogs = [
  { id: "1", action: "User role updated", actor: "alice@example.com", target: "bob@example.com", time: "2 min ago" },
  { id: "2", action: "Billing plan changed", actor: "alice@example.com", target: "org/plan", time: "1 hour ago" },
  { id: "3", action: "User created", actor: "alice@example.com", target: "eve@example.com", time: "3 hours ago" },
  { id: "4", action: "Permission granted", actor: "alice@example.com", target: "carol@example.com", time: "1 day ago" },
  { id: "5", action: "Config updated", actor: "bob@example.com", target: "settings/api", time: "2 days ago" },
]

const roleColors: Record<string, string> = {
  admin: "text-cyan-400 border-cyan-400/50",
  developer: "text-indigo-400 border-indigo-400/50",
  user: "text-slate-400 border-slate-400/50",
  auditor: "text-amber-400 border-amber-400/50",
}

export function AdminDashboard() {
  const [userSearch, setUserSearch] = useState("")

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-cyan-400" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">System management and enterprise controls</p>
        </div>
        <Badge className="bg-cyan-400/10 text-cyan-400 border-cyan-400/50">Admin Access</Badge>
      </div>

      {/* System stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "5", icon: Users, color: "text-cyan-400" },
          { label: "Active Sessions", value: "12", icon: Activity, color: "text-green-400" },
          { label: "API Requests/h", value: "1.2K", icon: Zap, color: "text-indigo-400" },
          { label: "System Health", value: "99.9%", icon: Server, color: "text-emerald-400" },
        ].map(s => (
          <Card key={s.label} className="border-border/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.08)] transition-shadow">
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

      {/* Main tabs */}
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-5 md:w-auto md:grid-cols-none md:flex">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API Monitor</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        {/* Users tab */}
        <TabsContent value="users" className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
            </div>
            <Button size="sm" className="shrink-0">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
          <Card className="border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-cyan-400/10 text-cyan-400 text-xs">
                            {user.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs capitalize ${roleColors[user.role] ?? ""}`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${user.status === "active" ? "bg-green-400" : "bg-slate-500"}`} />
                        <span className="text-xs capitalize">{user.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{user.joined}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Billing tab */}
        <TabsContent value="billing" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-400">Enterprise</div>
                <p className="text-xs text-muted-foreground mt-1">$299/month · Renews Jan 15, 2026</p>
                <Button size="sm" variant="outline" className="mt-3 w-full">
                  <CreditCard className="h-3.5 w-3.5 mr-1" />
                  Manage Billing
                </Button>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Seats Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5 / 25</div>
                <p className="text-xs text-muted-foreground mt-1">20 seats available</p>
                <Button size="sm" variant="outline" className="mt-3 w-full">Add Seats</Button>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">This Month's Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$312.40</div>
                <p className="text-xs text-muted-foreground mt-1">Base $299 + $13.40 overage</p>
                <Button size="sm" variant="outline" className="mt-3 w-full">View Invoice</Button>
              </CardContent>
            </Card>
          </div>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Usage Limits</CardTitle>
              <CardDescription>Configure per-user limits and overage rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "API calls/month", limit: "500,000", used: "412,000" },
                { label: "Storage", limit: "500 GB", used: "189 GB" },
                { label: "Build minutes", limit: "10,000 min", used: "7,320 min" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="text-sm">{item.label}</span>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.used}</p>
                    <p className="text-xs text-muted-foreground">of {item.limit}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Monitor tab */}
        <TabsContent value="api" className="space-y-4 mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                API Requests (Last 24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={apiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "8px" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="requests" fill="#22d3ee" radius={[4, 4, 0, 0]} opacity={0.85} name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Requests", value: "1,995", color: "text-cyan-400" },
              { label: "Error Rate", value: "0.2%", color: "text-green-400" },
              { label: "Avg Response", value: "124ms", color: "text-indigo-400" },
            ].map(s => (
              <Card key={s.label} className="border-border/50">
                <CardContent className="p-4 text-center">
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit Logs tab */}
        <TabsContent value="audit" className="space-y-4 mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Activity</CardTitle>
              <CardDescription>Admin actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {auditLogs.map((log, i) => (
                  <div key={log.id}>
                    <div className="flex items-start gap-3 py-3">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          by <span className="text-foreground">{log.actor}</span>
                          {" → "}{log.target}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{log.time}</span>
                    </div>
                    {i < auditLogs.length - 1 && <Separator className="opacity-30" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Config tab */}
        <TabsContent value="config" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "OAuth Providers", desc: "GitHub, Google (disabled by default)", status: "Disabled" },
              { label: "Rate Limiting", desc: "100 req/min per user", status: "Enabled" },
              { label: "2FA Enforcement", desc: "Require 2FA for admin roles", status: "Enabled" },
              { label: "Audit Logging", desc: "Log all admin actions", status: "Enabled" },
              { label: "SSO/SAML", desc: "Enterprise single sign-on", status: "Disabled" },
              { label: "IP Allowlisting", desc: "Restrict access by IP range", status: "Disabled" },
            ].map(cfg => (
              <Card key={cfg.label} className="border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{cfg.label}</p>
                    <p className="text-xs text-muted-foreground">{cfg.desc}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cfg.status === "Enabled"
                      ? "border-green-400/50 text-green-400"
                      : "border-slate-500/50 text-slate-400"}
                  >
                    {cfg.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
