import { NextRequest, NextResponse } from "next/server"

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  model: string
  agent?: string
}

export interface ChatResponse {
  response: string
  model: string
}

/**
 * Returns the API key for a given model ID based on environment variables.
 * Keys are read from environment variables for portability.
 */
function getApiKeyForModel(model: string): string | null {
  const openaiModels = ["gpt-4o", "gpt-4o-mini", "gpt-5-mini"]
  const anthropicModels = ["claude-sonnet-4", "claude-haiku-3.5"]
  const googleModels = ["gemini-2.0-flash", "gemini-3-flash"]
  const deepseekModels = ["deepseek-v3", "deepseek-coder-v2"]
  const mistralModels = ["mistral-large", "codestral"]

  if (openaiModels.includes(model)) return process.env.OPENAI_API_KEY ?? null
  if (anthropicModels.includes(model)) return process.env.ANTHROPIC_API_KEY ?? null
  if (googleModels.includes(model)) return process.env.GOOGLE_API_KEY ?? null
  if (deepseekModels.includes(model)) return process.env.DEEPSEEK_API_KEY ?? null
  if (mistralModels.includes(model)) return process.env.MISTRAL_API_KEY ?? null
  // Fallback: try generic AI_API_KEY
  return process.env.AI_API_KEY ?? null
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json()
    const { messages, model } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      )
    }

    if (!model) {
      return NextResponse.json(
        { error: "model is required" },
        { status: 400 }
      )
    }

    const apiKey = getApiKeyForModel(model)

    if (!apiKey) {
      // Graceful fallback: return a helpful message when no API key is configured
      return NextResponse.json<ChatResponse>({
        response: `No API key configured for model "${model}". Set the appropriate environment variable (e.g., OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY) to enable AI responses.`,
        model,
      })
    }

    // Route to the appropriate provider
    const response = await callAIProvider(model, messages, apiKey)
    return NextResponse.json<ChatResponse>({ response, model })
  } catch (error) {
    console.error("[/api/chat] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Calls the appropriate AI provider based on the model ID.
 * Supports OpenAI, Anthropic, Google, DeepSeek, and Mistral APIs.
 */
async function callAIProvider(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const openaiModels = ["gpt-4o", "gpt-4o-mini", "gpt-5-mini"]
  const anthropicModels = ["claude-sonnet-4", "claude-haiku-3.5"]
  const googleModels = ["gemini-2.0-flash", "gemini-3-flash"]

  if (openaiModels.includes(model)) {
    return callOpenAI(model, messages, apiKey)
  }
  if (anthropicModels.includes(model)) {
    return callAnthropic(model, messages, apiKey)
  }
  if (googleModels.includes(model)) {
    return callGoogle(model, messages, apiKey)
  }
  // Default: try OpenAI-compatible API (works for DeepSeek, Mistral, etc.)
  return callOpenAICompatible(model, messages, apiKey)
}

async function callOpenAI(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, max_tokens: 4096 }),
  })
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ""
}

async function callAnthropic(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const anthropicModel = model === "claude-sonnet-4" ? "claude-sonnet-4-5" : "claude-haiku-3-5-20241022"
  const system = messages.find((m) => m.role === "system")?.content
  const userMessages = messages.filter((m) => m.role !== "system")
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: anthropicModel,
      max_tokens: 4096,
      ...(system ? { system } : {}),
      messages: userMessages,
    }),
  })
  if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`)
  const data = await res.json()
  return data.content?.[0]?.text ?? ""
}

async function callGoogle(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const googleModel = model === "gemini-3-flash" ? "gemini-2.5-flash-preview-04-17" : "gemini-2.0-flash"
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }))
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${googleModel}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 4096 } }),
    }
  )
  if (!res.ok) throw new Error(`Google API error: ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
}

async function callOpenAICompatible(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1"
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, max_tokens: 4096 }),
  })
  if (!res.ok) throw new Error(`AI API error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ""
}
