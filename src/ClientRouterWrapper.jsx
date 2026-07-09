"use client"
import dynamic from 'next/dynamic'

const DynamicBrowserRouter = dynamic(
  async () => {
    const mod = await import('react-router-dom')
    return ({ children }) => mod.BrowserRouter ? <mod.BrowserRouter>{children}</mod.BrowserRouter> : <>{children}</>
  },
  { ssr: false }
)

export default function ClientRouterWrapper({ children }) {
  return <DynamicBrowserRouter>{children}</DynamicBrowserRouter>
}
