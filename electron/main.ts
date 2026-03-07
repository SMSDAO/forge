import { app, BrowserWindow, shell, nativeTheme } from 'electron'
import path from 'path'

// Keep a global reference to prevent garbage collection.
let mainWindow: BrowserWindow | null = null

function createWindow(): void {
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
  const indexPath = app.isPackaged
    ? path.join(app.getAppPath(), 'out', 'index.html')
    : path.join(process.cwd(), 'out', 'index.html')

  mainWindow.loadFile(indexPath)

  // Open all target="_blank" links in the OS default browser rather than a
  // new Electron window, and block all other new-window requests.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  // macOS: re-create the window when the dock icon is clicked and no other
  // windows are open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS where it is conventional
// for applications to remain open until the user explicitly quits.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
