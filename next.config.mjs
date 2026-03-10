/** @type {import('next').NextConfig} */
const isAndroidBuild = process.env.NEXT_BUILD_TARGET === 'android'
const isDesktopBuild = process.env.NEXT_BUILD_TARGET === 'desktop'
// Both Android (Capacitor) and Desktop (Electron) require a fully static export.
const isStaticExport = isAndroidBuild || isDesktopBuild

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Static export required when bundling the web layer into a native wrapper.
  // Android:  pnpm run export:android
  // Desktop:  pnpm run export:desktop
  ...(isStaticExport && {
    output: 'export',
    trailingSlash: true,
  }),
}

export default nextConfig
