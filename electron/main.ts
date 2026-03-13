import { app, BrowserWindow, shell, nativeTheme, dialog } from 'electron'
import path from 'path'
import { pathToFileURL } from 'url'

// Keep a global reference to prevent garbage collection.
let mainWindow: BrowserWindow | null = null

async function createWindow(): Promise<void> {
  nativeTheme.themeSource = 'dark'

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#040d12',
    // Use hidden-inset title bar on macOS so the window feels native.
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // Keep the renderer sandboxed; all Node.js access goes through the
      // contextBridge defined in preload.ts.
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      // Disallow navigating to remote origins.
      allowRunningInsecureContent: false,
    },
  })

  // Load the static Next.js export bundled into the app package.
  const outDir = app.isPackaged
    ? path.join(app.getAppPath(), 'out')
    : path.join(process.cwd(), 'out')

  const indexPath = path.join(outDir, 'index.html')

  // Normalised file:// base for the out/ directory (trailing slash prevents
  // escaping to sibling paths like "out-extra/").
  const rawOutUrl = pathToFileURL(outDir).href
  const outDirFileUrl = rawOutUrl.endsWith('/') ? rawOutUrl : rawOutUrl + '/'

  try {
    await mainWindow.loadFile(indexPath)
  } catch (err) {
    dialog.showErrorBox(
      'FORGES — Failed to load',
      `Could not load the application UI.\n\n` +
        `Expected: ${indexPath}\n\n` +
        `Run 'pnpm run export:desktop' to generate the static export, ` +
        `then try again.\n\n` +
        String(err),
    )
    app.exit(1)
    return // app.exit() is void (not never) in Electron's types; return keeps
           // TypeScript from trying to run the rest of the function.
  }

  // Open all target="_blank" links in the OS default browser rather than a
  // new Electron window, and block all other new-window requests.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  // Prevent the current window from navigating away from local file:// content.
  // Only file:// URLs inside the bundled out/ directory are permitted; any
  // remote http(s) navigation is opened externally instead.
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('file://')) {
      // Block file:// URLs that escape the bundled out/ directory.
      if (!url.startsWith(outDirFileUrl)) {
        event.preventDefault()
      }
    } else {
      event.preventDefault()
      if (url.startsWith('https://') || url.startsWith('http://')) {
        shell.openExternal(url)
      }
    }
  })

  mainWindow.webContents.on('will-redirect', (event, url) => {
    if (url.startsWith('file://')) {
      // Block file:// redirects that escape the bundled out/ directory.
      if (!url.startsWith(outDirFileUrl)) {
        event.preventDefault()
      }
    } else {
      event.preventDefault()
      if (url.startsWith('https://') || url.startsWith('http://')) {
        shell.openExternal(url)
      }
    }
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function launchWindow(): void {
  void createWindow().catch((err) => {
    dialog.showErrorBox('FORGES — Fatal error', String(err))
    app.exit(1)
  })
}

app.whenReady().then(() => {
  launchWindow()

  // macOS: re-create the window when the dock icon is clicked and no other
  // windows are open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) launchWindow()
  })
})

// Quit when all windows are closed, except on macOS where it is conventional
// for applications to remain open until the user explicitly quits.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
