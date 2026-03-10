# FORGES Desktop Build Guide

This document explains how to build the FORGES platform as a standalone desktop application using [Electron](https://electronjs.org/) and [electron-builder](https://www.electron.build/).

Supported targets:

| Platform | Format | Architecture |
|----------|--------|-------------|
| Windows | NSIS installer (`.exe`) | x64 |
| macOS | Disk image (`.dmg`) | x64, arm64 (Apple Silicon) |
| Linux | AppImage (`.AppImage`) | x64 |

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm install -g pnpm` |

> **macOS only:** To produce a signed, notarised `.dmg` you also need Xcode Command Line Tools and an Apple Developer certificate. See [Code Signing](#code-signing) below.

---

## Quick Start

```bash
# 1. Install all dependencies
pnpm install

# 2. Build the static export + compile Electron TypeScript + package
#    (produces installer for the current host OS)
pnpm run build:desktop

# Alternatively, target a specific platform:
pnpm run build:desktop:win    # → dist-desktop/*.exe
pnpm run build:desktop:mac    # → dist-desktop/*.dmg
pnpm run build:desktop:linux  # → dist-desktop/*.AppImage
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm run export:desktop` | Builds Next.js with `output: 'export'` (`NEXT_BUILD_TARGET=desktop`) |
| `pnpm run build:electron` | Compiles `electron/main.ts` + `electron/preload.ts` → `electron/dist/` |
| `pnpm run build:desktop` | Full pipeline: export → compile → package (current OS) |
| `pnpm run build:desktop:win` | Full pipeline targeting Windows |
| `pnpm run build:desktop:mac` | Full pipeline targeting macOS |
| `pnpm run build:desktop:linux` | Full pipeline targeting Linux |
| `pnpm run dev:electron` | Builds the static export, compiles Electron TypeScript, then launches Electron (full pipeline — no pre-steps required) |

---

## Architecture

The desktop application is a thin Electron wrapper around the Next.js web app:

```
┌──────────────────────────────────────┐
│  Electron Main Process (Node.js)     │
│  electron/main.ts                    │
│  • Creates BrowserWindow             │
│  • Loads out/index.html (local file) │
│  • Opens external links in browser   │
└──────────────┬───────────────────────┘
               │ contextBridge (IPC)
┌──────────────▼───────────────────────┐
│  Renderer Process (sandboxed)        │
│  electron/preload.ts                 │
│  • Exposes platform / isPackaged     │
│                                      │
│  Next.js static export (out/)        │
│  • Full FORGES UI                    │
└──────────────────────────────────────┘
```

The renderer is sandboxed (`sandbox: true`, `nodeIntegration: false`,
`contextIsolation: true`), so no Node.js APIs are directly accessible
from application code. The only bridge is the `window.electronAPI` object
exposed by `electron/preload.ts`.

---

## Build Pipeline Details

### 1. `export:desktop`

Runs `next build` with `NEXT_BUILD_TARGET=desktop` which activates:

```js
output: 'export'
trailingSlash: true
```

in `next.config.mjs`, producing a fully static site in `out/`.

### 2. `build:electron`

Compiles `electron/main.ts` and `electron/preload.ts` using the dedicated
`electron/tsconfig.json` (target: `ES2020`, module: `commonjs`) into
`electron/dist/`.

### 3. electron-builder

Packages `out/` + `electron/dist/` into a platform-specific installer
according to the `"build"` block in `package.json`.

---

## Project Structure

```
electron/
├── main.ts           # Electron main process — window creation & lifecycle
├── preload.ts        # Context bridge — exposes safe API to renderer
├── tsconfig.json     # TypeScript config for electron/ (CommonJS target)
└── dist/             # Compiled output (git-ignored)

dist-desktop/         # Packaged installers output by electron-builder (git-ignored)

next.config.mjs       # Conditionally enables output: 'export' for desktop/android
package.json          # "build" block holds electron-builder configuration
```

---

## CI/CD (GitHub Actions)

The workflow at `.github/workflows/desktop-build.yml` uses a matrix strategy
to build all three platforms in parallel on every push to `main` and every PR:

| Job | Runner | Artifact |
|-----|--------|----------|
| Windows (.exe) | `windows-latest` | `forges-windows-installer` |
| macOS (.dmg) | `macos-latest` | `forges-macos-dmg` |
| Linux (AppImage) | `ubuntu-latest` | `forges-linux-appimage` |

Installers are uploaded as GitHub Actions artifacts (30-day retention) and
attached to GitHub Releases when a `v*` tag is pushed.

---

## Code Signing

### Windows

Set the following repository secrets to sign the NSIS installer:

| Secret | Description |
|--------|-------------|
| `WIN_CSC_LINK` | Base64-encoded `.p12` / `.pfx` certificate |
| `WIN_CSC_KEY_PASSWORD` | Certificate password |

Pass them to the build step:

```yaml
env:
  CSC_LINK: ${{ secrets.WIN_CSC_LINK }}
  CSC_KEY_PASSWORD: ${{ secrets.WIN_CSC_KEY_PASSWORD }}
```

### macOS

Set the following repository secrets:

| Secret | Description |
|--------|-------------|
| `MAC_CSC_LINK` | Base64-encoded `.p12` Developer ID Application certificate |
| `MAC_CSC_KEY_PASSWORD` | Certificate password |
| `APPLE_ID` | Apple ID used for notarisation |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password for notarisation |
| `APPLE_TEAM_ID` | 10-character Apple Developer Team ID |

Pass them to the build step and enable discovery:

```yaml
env:
  CSC_LINK: ${{ secrets.MAC_CSC_LINK }}
  CSC_KEY_PASSWORD: ${{ secrets.MAC_CSC_KEY_PASSWORD }}
  APPLE_ID: ${{ secrets.APPLE_ID }}
  APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
  APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
  CSC_IDENTITY_AUTO_DISCOVERY: true
```

### Linux

AppImage packages do not require code signing.

---

## Icons

The build currently uses the icons from `public/`:

- `public/placeholder-logo.png` — Windows (NSIS installer) & Linux (AppImage)
- `public/apple-icon.png` — macOS (.dmg)

For production builds, replace these with higher-resolution PNG source files
(512×512 px or 1024×1024 px recommended). electron-builder will generate
`.ico` (Windows) and `.icns` (macOS) automatically from a high-res PNG if
the source image is large enough.

---

## Troubleshooting

**`export:desktop` fails with server-action errors**
Ensure no page in `app/` calls `"use server"` functions at build time.
Dashboard pages that call server actions need a client-side data-fetch
fallback for the static export to succeed.

**`out/` directory is empty after export**
Run `pnpm run export:desktop` explicitly and check for Next.js build errors.

**`electron/dist/main.js` not found**
Run `pnpm run build:electron` to compile the Electron TypeScript before
packaging.

**`NSIS error` on Windows**
Ensure the Windows runner has the Visual C++ Redistributable installed.
`windows-latest` GitHub-hosted runners include it by default.

**macOS Gatekeeper blocks the app**
Without a valid Developer ID certificate and notarisation, macOS will
quarantine the app. For development, right-click → Open to bypass
Gatekeeper, or follow the [Code Signing](#code-signing) steps above.
