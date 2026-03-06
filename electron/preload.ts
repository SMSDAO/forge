import { contextBridge } from 'electron'

// Expose a minimal, safe API surface to the renderer process.
// All values are read-only and contain no privileged capabilities.
contextBridge.exposeInMainWorld('electronAPI', {
  /** The host platform: 'darwin' | 'win32' | 'linux' */
  platform: process.platform as 'darwin' | 'win32' | 'linux',
  /**
   * true when the app is running from a packaged installer.
   * Uses Electron's built-in process.isPackaged (available in preload context
   * since Electron 8+), which is set to true by the packager at build time.
   */
  isPackaged: process.isPackaged,
})
