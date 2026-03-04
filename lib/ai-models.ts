export type ModelProvider =
  | "openai"
  | "google"
  | "anthropic"
  | "meta"
  | "microsoft"
  | "mistral"
  | "deepseek"
  | "cohere"

export type AgentRole =
  | "coder"
  | "designer"
  | "architect"
  | "debugger"
  | "reviewer"
  | "devops"
  | "database"
  | "general"

export interface AIModel {
  id: string
  name: string
  provider: ModelProvider
  description: string
  contextWindow: string
  speed: "fast" | "medium" | "slow"
  quality: "standard" | "high" | "premium"
  free: boolean
  tags: string[]
  color: string
  icon: string
}

export interface AIAgent {
  id: string
  name: string
  role: AgentRole
  description: string
  systemPrompt: string
  preferredModel: string
  color: string
  icon: string
  capabilities: string[]
}

export interface DBConfig {
  id: string
  name: string
  type: "postgresql" | "mysql" | "sqlite" | "mongodb" | "redis" | "supabase" | "neon" | "planetscale"
  description: string
  icon: string
  color: string
  autoSetup: boolean
  envVars: string[]
}

export const AI_MODELS: AIModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast, affordable model for lightweight tasks",
    contextWindow: "128K",
    speed: "fast",
    quality: "standard",
    free: true,
    tags: ["free", "fast", "coding"],
    color: "#10a37f",
    icon: "O",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Most capable OpenAI model for complex reasoning",
    contextWindow: "128K",
    speed: "medium",
    quality: "premium",
    free: false,
    tags: ["premium", "reasoning", "coding"],
    color: "#10a37f",
    icon: "O",
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "openai",
    description: "Latest generation lightweight model from OpenAI",
    contextWindow: "200K",
    speed: "fast",
    quality: "high",
    free: false,
    tags: ["new", "fast", "coding"],
    color: "#10a37f",
    icon: "O",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    description: "Ultra-fast Google model, great for code generation",
    contextWindow: "1M",
    speed: "fast",
    quality: "high",
    free: true,
    tags: ["free", "fast", "1M context"],
    color: "#4285f4",
    icon: "G",
  },
  {
    id: "gemini-3-flash",
    name: "Gemini 3 Flash",
    provider: "google",
    description: "Latest Gemini model with multimodal capabilities",
    contextWindow: "1M",
    speed: "fast",
    quality: "premium",
    free: true,
    tags: ["free", "multimodal", "latest"],
    color: "#4285f4",
    icon: "G",
  },
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    description: "Best coding model with exceptional reasoning",
    contextWindow: "200K",
    speed: "medium",
    quality: "premium",
    free: false,
    tags: ["premium", "coding", "reasoning"],
    color: "#d4a27f",
    icon: "C",
  },
  {
    id: "claude-haiku-3.5",
    name: "Claude Haiku 3.5",
    provider: "anthropic",
    description: "Fast and affordable Claude for quick tasks",
    contextWindow: "200K",
    speed: "fast",
    quality: "standard",
    free: true,
    tags: ["free", "fast", "lightweight"],
    color: "#d4a27f",
    icon: "C",
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "meta",
    description: "Open-source powerhouse from Meta, great for code",
    contextWindow: "128K",
    speed: "medium",
    quality: "high",
    free: true,
    tags: ["free", "open-source", "coding"],
    color: "#0668e1",
    icon: "L",
  },
  {
    id: "llama-4-scout",
    name: "Llama 4 Scout",
    provider: "meta",
    description: "Latest Llama with 10M context, mixture of experts",
    contextWindow: "10M",
    speed: "fast",
    quality: "high",
    free: true,
    tags: ["free", "10M context", "MoE"],
    color: "#0668e1",
    icon: "L",
  },
  {
    id: "phi-4",
    name: "Phi-4",
    provider: "microsoft",
    description: "Microsoft small model, efficient for code tasks",
    contextWindow: "16K",
    speed: "fast",
    quality: "standard",
    free: true,
    tags: ["free", "small", "efficient"],
    color: "#00bcf2",
    icon: "P",
  },
  {
    id: "phi-4-multimodal",
    name: "Phi-4 Multimodal",
    provider: "microsoft",
    description: "Vision + code from Microsoft, handles images",
    contextWindow: "128K",
    speed: "fast",
    quality: "high",
    free: true,
    tags: ["free", "multimodal", "vision"],
    color: "#00bcf2",
    icon: "P",
  },
  {
    id: "mistral-large",
    name: "Mistral Large 2",
    provider: "mistral",
    description: "Powerful European model for complex reasoning",
    contextWindow: "128K",
    speed: "medium",
    quality: "high",
    free: false,
    tags: ["reasoning", "multilingual"],
    color: "#f7d046",
    icon: "M",
  },
  {
    id: "codestral",
    name: "Codestral",
    provider: "mistral",
    description: "Mistral dedicated coding model, 32K fill-in-middle",
    contextWindow: "32K",
    speed: "fast",
    quality: "high",
    free: true,
    tags: ["free", "coding", "FIM"],
    color: "#f7d046",
    icon: "M",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "deepseek",
    description: "Top-tier open MoE model, rivals GPT-4",
    contextWindow: "128K",
    speed: "medium",
    quality: "premium",
    free: true,
    tags: ["free", "open-source", "MoE"],
    color: "#5b6ee1",
    icon: "D",
  },
  {
    id: "deepseek-coder-v2",
    name: "DeepSeek Coder V2",
    provider: "deepseek",
    description: "Specialized coding model with strong performance",
    contextWindow: "128K",
    speed: "fast",
    quality: "high",
    free: true,
    tags: ["free", "coding", "open-source"],
    color: "#5b6ee1",
    icon: "D",
  },
  {
    id: "command-r-plus",
    name: "Command R+",
    provider: "cohere",
    description: "RAG-optimized model with grounded generation",
    contextWindow: "128K",
    speed: "medium",
    quality: "high",
    free: true,
    tags: ["free", "RAG", "grounded"],
    color: "#39594d",
    icon: "R",
  },
]

export const AI_AGENTS: AIAgent[] = [
  {
    id: "forge-coder",
    name: "Forge Coder",
    role: "coder",
    description: "Expert full-stack developer. Writes clean, production-ready code.",
    systemPrompt: "You are an expert full-stack developer. Write clean, well-structured, production-ready code following best practices.",
    preferredModel: "gemini-3-flash",
    color: "#22c55e",
    icon: "FC",
    capabilities: ["Code generation", "Refactoring", "Bug fixing", "API development"],
  },
  {
    id: "forge-designer",
    name: "Forge Designer",
    role: "designer",
    description: "UI/UX specialist. Creates beautiful, accessible interfaces.",
    systemPrompt: "You are a UI/UX design expert. Create beautiful, responsive, accessible interfaces using modern design principles and Tailwind CSS.",
    preferredModel: "claude-sonnet-4",
    color: "#f472b6",
    icon: "FD",
    capabilities: ["UI design", "Component styling", "Responsive layouts", "Animations"],
  },
  {
    id: "forge-architect",
    name: "Forge Architect",
    role: "architect",
    description: "System design expert. Plans scalable architectures.",
    systemPrompt: "You are a software architect. Design scalable, maintainable system architectures with proper patterns, state management, and data flow.",
    preferredModel: "gpt-4o",
    color: "#a78bfa",
    icon: "FA",
    capabilities: ["System design", "DB schema", "API design", "Performance"],
  },
  {
    id: "forge-debugger",
    name: "Forge Debugger",
    role: "debugger",
    description: "Bug hunter. Finds and fixes issues quickly.",
    systemPrompt: "You are a debugging expert. Analyze code for bugs, suggest fixes, and explain root causes clearly.",
    preferredModel: "deepseek-v3",
    color: "#ef4444",
    icon: "FB",
    capabilities: ["Error analysis", "Stack traces", "Performance issues", "Memory leaks"],
  },
  {
    id: "forge-reviewer",
    name: "Forge Reviewer",
    role: "reviewer",
    description: "Code reviewer. Ensures quality and best practices.",
    systemPrompt: "You are a senior code reviewer. Review code for quality, security, performance, and adherence to best practices.",
    preferredModel: "claude-sonnet-4",
    color: "#f59e0b",
    icon: "FR",
    capabilities: ["Code review", "Security audit", "Best practices", "Optimization"],
  },
  {
    id: "forge-devops",
    name: "Forge DevOps",
    role: "devops",
    description: "Deployment and infrastructure expert.",
    systemPrompt: "You are a DevOps engineer. Help with deployment, CI/CD pipelines, Docker, Kubernetes, and infrastructure management.",
    preferredModel: "gpt-4o-mini",
    color: "#06b6d4",
    icon: "FO",
    capabilities: ["Deployment", "CI/CD", "Docker", "Monitoring"],
  },
  {
    id: "forge-database",
    name: "Forge DBA",
    role: "database",
    description: "Database specialist. Schemas, queries, and migrations.",
    systemPrompt: "You are a database administrator. Design efficient schemas, write optimized queries, and manage migrations.",
    preferredModel: "deepseek-coder-v2",
    color: "#8b5cf6",
    icon: "DB",
    capabilities: ["Schema design", "Query optimization", "Migrations", "Indexing"],
  },
  {
    id: "forge-general",
    name: "Forge Assistant",
    role: "general",
    description: "General purpose AI assistant for any task.",
    systemPrompt: "You are a helpful AI assistant. Help the user with any task they need.",
    preferredModel: "gemini-3-flash",
    color: "#64748b",
    icon: "AI",
    capabilities: ["General help", "Explanations", "Documentation", "Planning"],
  },
]

export const DB_CONFIGS: DBConfig[] = [
  {
    id: "supabase",
    name: "Supabase",
    type: "supabase",
    description: "Open-source Firebase alternative with Postgres, Auth, and Realtime",
    icon: "S",
    color: "#3ecf8e",
    autoSetup: true,
    envVars: ["SUPABASE_URL", "SUPABASE_ANON_KEY"],
  },
  {
    id: "neon",
    name: "Neon",
    type: "neon",
    description: "Serverless Postgres with branching and autoscaling",
    icon: "N",
    color: "#00e599",
    autoSetup: true,
    envVars: ["DATABASE_URL"],
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    type: "planetscale",
    description: "MySQL-compatible serverless database platform",
    icon: "P",
    color: "#f0f0f0",
    autoSetup: true,
    envVars: ["DATABASE_URL"],
  },
  {
    id: "mongodb",
    name: "MongoDB Atlas",
    type: "mongodb",
    description: "Document database for modern apps",
    icon: "M",
    color: "#00ed64",
    autoSetup: true,
    envVars: ["MONGODB_URI"],
  },
  {
    id: "redis",
    name: "Upstash Redis",
    type: "redis",
    description: "Serverless Redis for caching and rate limiting",
    icon: "R",
    color: "#dc382d",
    autoSetup: true,
    envVars: ["UPSTASH_REDIS_URL", "UPSTASH_REDIS_TOKEN"],
  },
  {
    id: "sqlite",
    name: "SQLite (Turso)",
    type: "sqlite",
    description: "Edge-friendly embedded SQL database",
    icon: "T",
    color: "#4ff8d2",
    autoSetup: true,
    envVars: ["TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"],
  },
]

export function getModelsByProvider(provider: ModelProvider): AIModel[] {
  return AI_MODELS.filter((m) => m.provider === provider)
}

export function getFreeModels(): AIModel[] {
  return AI_MODELS.filter((m) => m.free)
}

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((m) => m.id === id)
}

export function getAgentById(id: string): AIAgent | undefined {
  return AI_AGENTS.find((a) => a.id === id)
}

export function getProviderColor(provider: ModelProvider): string {
  const colors: Record<ModelProvider, string> = {
    openai: "#10a37f",
    google: "#4285f4",
    anthropic: "#d4a27f",
    meta: "#0668e1",
    microsoft: "#00bcf2",
    mistral: "#f7d046",
    deepseek: "#5b6ee1",
    cohere: "#39594d",
  }
  return colors[provider]
}

export function getProviderLabel(provider: ModelProvider): string {
  const labels: Record<ModelProvider, string> = {
    openai: "OpenAI",
    google: "Google",
    anthropic: "Anthropic",
    meta: "Meta",
    microsoft: "Microsoft",
    mistral: "Mistral",
    deepseek: "DeepSeek",
    cohere: "Cohere",
  }
  return labels[provider]
}
