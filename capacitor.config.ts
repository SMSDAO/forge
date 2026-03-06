import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.smsdao.forges',
  appName: 'FORGES',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Set SERVER_URL at build time to point the APK at a deployed instance.
    // When unset the APK runs entirely from the bundled static export in `out/`.
    ...(process.env.SERVER_URL ? { url: process.env.SERVER_URL, cleartext: false } : {}),
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#040d12',
      showSpinner: false,
    },
  },
}

export default config
