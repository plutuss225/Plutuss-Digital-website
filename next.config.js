import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    // Redirect imports from `react-router-dom` to a small compatibility shim
    config.resolve.alias['react-router-dom'] = path.resolve(__dirname, 'src', 'routerCompat.js')
    return config
  },
}

export default nextConfig
