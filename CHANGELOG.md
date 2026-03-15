# Changelog

All notable changes to FORGES will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-15

### Added
- Enterprise tab-based navigation shell (Home, Dashboard, Users, Admin, Developer, Settings, Docs)
- User Dashboard with activity metrics, notifications, and metered usage panel
- Admin Dashboard with user/role/permission management, billing controls, API monitoring, and audit logs
- Developer Dashboard with API latency charts, log viewer, environment management, integration test console, and deployment diagnostics
- Settings page with profile, notifications, security, billing, and API key management
- Documentation landing page at /docs
- Login and registration pages with Neo-Glow styling
- CI/CD GitHub Actions workflows for lint+typecheck, Next.js build, and release tagging
- RBAC system with Admin, Developer, Reviewer, Viewer, and Billing roles
- Metered usage tracking panel with per-resource consumption bars
- Health endpoint at /api/health with uptime and version reporting
- Security middleware with HTTP security headers (X-Frame-Options, CSP, X-Content-Type-Options, HSTS, Permissions-Policy)
- .env.example with all required environment variables documented
- PWA manifest.json for installable web app support
- Neo-Glow design system with cyan/blue gradients, soft glow effects, and smooth transitions
- Responsive mobile layout with bottom tab navigation
- Keyboard navigation support across all navigation elements

### Changed
- App layout body no longer uses overflow-hidden to allow proper page scrolling
- Dashboard page replaced with full User Dashboard component

### Security
- Added HTTP security headers via Next.js middleware
- Content Security Policy configured for production use
- HSTS header enabled for HTTPS enforcement
