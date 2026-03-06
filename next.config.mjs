/** @type {import('next').NextConfig} */
const isAndroidBuild = process.env.NEXT_BUILD_TARGET === 'android'

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Static export required when bundling the web layer into an Android APK.
  // Activate with:  NEXT_BUILD_TARGET=android pnpm build
  ...(isAndroidBuild && {
    output: 'export',
    trailingSlash: true,
  }),
}

export default nextConfig
