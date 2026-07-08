import { useEffect } from 'react'
import IconCard from '../components/IconCard'
import PageBanner from '../components/PageBanner'

export default function SolutionsPage() {
  const solutions = [
    {
      icon: 'briefcase2',
      title: 'Portfolio Management',
      text: 'Facilitates seamless integration with various exchanges and wallets, enabling users to manage account details, view balances, and monitor holdings across all linked accounts for informed decision-making.',
      color: 'rgba(123, 67, 250, 0.1)'
    },
    {
      icon: 'shield-exclamation',
      title: 'Risk Management',
      text: 'Empowers users to strategically manage imported assets and execute buy decisions based on detailed analysis, identifying potential risks and losses for proactive investment strategies.',
      color: 'rgba(236, 72, 153, 0.1)'
    },
    {
      icon: 'cpu',
      title: 'Crypto Algorithms',
      text: 'Empowers users with comprehensive market insights, real-time analysis, and asset strategies developed by our in-house team, designed to achieve superior long-term returns.',
      color: 'rgba(16, 185, 129, 0.1)'
    },
    {
      icon: 'building',
      title: 'Institutional Solutions',
      text: 'Tailored for hedge funds, family offices, and asset managers. Access prime brokerage services, custodial integrations, and regulatory reporting tools in a single, compliant environment.',
      color: 'rgba(245, 158, 11, 0.1)'
    },
    {
      icon: 'bar-chart',
      title: 'Market Intelligence',
      text: 'Real-time sentiment analytics, on-chain data feeds, and proprietary market signals to help you identify emerging opportunities before the crowd moves.',
      color: 'rgba(59, 130, 246, 0.1)'
    },
    {
      icon: 'arrow-left-right',
      title: 'OTC & Liquidity',
      text: 'Access over-the-counter trading desks and deep liquidity networks for large block orders, minimizing market impact while securing best-in-class pricing on every trade.',
      color: 'rgba(139, 92, 246, 0.1)'
    },
  ]

  return (
    <main className="main">
      <PageBanner title="Solutions" breadcrumbs={[{ label: 'Solutions' }]} />

      {/* ── Why Choose Us ─────────────────────────────────── */}
      <section className="section py-5 bg-light">
        <div className="container py-4">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 pe-lg-5" data-aos="fade-right">
              <span className="page-section-kicker">The Plutus Advantage</span>
              <h2 className="page-section-title">Why teams choose Plutus</h2>
              <p className="page-section-subtitle mb-4">
                From portfolio oversight to risk analysis and algorithmic intelligence, every capability is designed to support confident, scalable decision-making.
              </p>
              <div className="page-visual-card mt-4">
                <img src="/Future of digital marketing.webp" alt="Plutus strategy and growth" />
                <span className="page-visual-badge">Strategy-first execution</span>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row gy-4">
                {[
                  { icon: 'diagram-3', title: 'Unified multi-exchange connectivity' },
                  { icon: 'shield-check', title: 'Real-time risk monitoring & alerts' },
                  { icon: 'cpu', title: 'Proprietary crypto algorithms' },
                  { icon: 'building-lock', title: 'Institutional compliance tools' },
                  { icon: 'headset', title: '24/7 dedicated support' }
                ].map((item, idx) => (
                  <div className="col-md-6" key={item.title} data-aos="fade-up" data-aos-delay={100 * (idx + 1)}>
                    <div className="d-flex align-items-start gap-3 p-3 bg-white rounded-4 shadow-sm h-100 transition-hover content-card">
                      <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style={{ width: '48px', height: '48px', flexShrink: 0, fontSize: '1.25rem' }}>
                        <i className={`bi bi-${item.icon}`}></i>
                      </div>
                      <div className="pt-2">
                        <h6 className="fw-bold text-dark mb-0">{item.title}</h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Solutions Grid ────────────────────────────────── */}
      <section className="section py-5">
        <div className="container">
          <div className="section-title text-center mb-5" data-aos="fade-up">
            <h2 className="fw-bold">Our Solutions</h2>
            <p className="fs-5 text-muted">Comprehensive tools for every investment strategy</p>
          </div>
          <div className="row gy-4">
            {solutions.map(({ icon, title, text, color }) => (
              <IconCard
                key={title}
                icon={icon}
                title={title}
                text={text}
                iconBgColor={color}
                iconSize="64px"
                iconRadius="16px"
                iconFontSize="1.6rem"
                cardClassName="content-card h-100 p-4"
              />
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
