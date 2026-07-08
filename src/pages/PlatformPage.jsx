import { useEffect } from 'react'
import IconCard from '../components/IconCard'
import PageBanner from '../components/PageBanner'

export default function PlatformPage() {
  const features = [
    {
      icon: 'bar-chart-line',
      title: 'Order Execution Management',
      text: 'Our OEMS provides smart order routing across multiple venues, ensuring best-price execution with minimal slippage. Access deep liquidity pools and institutional-grade order types from a single interface.'
    },
    {
      icon: 'briefcase',
      title: 'Portfolio Management System',
      text: 'Manage all your digital asset holdings with a unified dashboard. Monitor real-time performance, track P&L, and maintain full visibility across multiple wallets and exchange accounts.'
    },
    {
      icon: 'shield-exclamation',
      title: 'Risk Management Tools',
      text: 'Protect your capital with advanced risk analytics. Set automated position limits, stop-loss triggers, and exposure controls that align with your investment mandate and risk appetite.'
    },
    {
      icon: 'diagram-3',
      title: 'API Access & Integration',
      text: 'Seamlessly connect existing systems via our REST and WebSocket APIs. Our infrastructure-agnostic design allows institutions to integrate Plutus into existing workflows with minimal friction.'
    },
    {
      icon: 'graph-up',
      title: 'Market Analytics',
      text: 'Access institutional-quality market data, charting tools, and trade analytics. Make data-driven decisions backed by real-time insights across all supported assets and venues.'
    },
    {
      icon: 'lock',
      title: 'Institutional Security',
      text: 'Multi-signature wallets, hardware security module (HSM) support, audit trails, and compliance-ready infrastructure ensure your assets and operations meet the highest security standards.'
    },
  ]

  return (
    <main className="main">
      <PageBanner title="Platform Overview" breadcrumbs={[{ label: 'Platform' }]} />

      {/* ── Unified access ────────────────────────────────── */}
      <section className="section py-5">
        <div className="container" data-aos="fade-up">
          <div className="content-card page-hero-shell p-4 p-lg-5">
            <div className="row align-items-center gy-4">
              <div className="col-lg-7">
                <span className="page-section-kicker">Unified Access</span>
                <h2 className="page-section-title">A dynamic platform for modern digital markets</h2>
                <p className="page-section-subtitle">
                  These solutions are available through our user interface and/or API. Our specialized
                  infrastructure offers a unified access point for digital assets trading, linking a
                  fragmented ecosystem to deliver deep liquidity and optimal price execution.
                </p>
                <ul className="page-feature-list">
                  <li><i className="bi bi-check-circle-fill"></i> Deep liquidity with institutional-grade execution</li>
                  <li><i className="bi bi-check-circle-fill"></i> Real-time portfolio, risk and analytics visibility</li>
                  <li><i className="bi bi-check-circle-fill"></i> Fast API integration for modern trading workflows</li>
                </ul>
              </div>
              <div className="col-lg-5">
                <div className="page-visual-card">
                  <img src="/hero-01.webp" alt="Plutus platform dashboard" />
                  <span className="page-visual-badge">Live market visibility</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Features ─────────────────────────────── */}
      <section className="section py-5">
        <div className="container">
          <div className="section-title text-center mb-5" data-aos="fade-up">
            <h2 className="fw-bold">Platform Capabilities</h2>
            <p className="fs-5 text-muted">Everything you need to manage digital assets at scale</p>
          </div>
          <div className="row gy-4">
            {features.map(({ icon, title, text }, idx) => (
              <IconCard
                key={title}
                icon={icon}
                title={title}
                text={text}
                delay={100 * (idx + 1)}
                iconSize="64px"
                iconRadius="16px"
                iconFontSize="1.6rem"
                cardClassName="content-card h-100 p-4 transition-hover"
              />
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
