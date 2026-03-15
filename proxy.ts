import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Security middleware for FORGES.
 * Adds HTTP security headers to all responses.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // X-Frame-Options: prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY")

  // X-Content-Type-Options: prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")

  // Referrer-Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Permissions-Policy: disable unused browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  )

  // X-XSS-Protection (legacy browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // HSTS (only in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icons, manifest
     */
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|manifest).*)",
  ],
}
