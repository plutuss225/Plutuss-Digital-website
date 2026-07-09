const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    // Redirect imports from `react-router-dom` to a small compatibility shim
    config.resolve.alias['react-router-dom'] = path.resolve(__dirname, 'src', 'routerCompat.js')
    return config
  },
}
