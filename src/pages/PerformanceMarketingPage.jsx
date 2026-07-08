import { NavLink } from 'react-router-dom'
import PageBanner from '../components/PageBanner'

const services = [
  { name: 'SEO Marketing', path: '/services/seo' },
  { name: 'Content Marketing', path: '/services/content' },
  { name: 'Social Media Marketing', path: '/services/social-media' },
  { name: 'Branding & Design', path: '/services/branding' },
  { name: 'Website Development', path: '/services/web' },
  { name: 'Performance Marketing', path: '/services/performance', active: true },
]

const features = [
  { title: 'Google Ads', description: 'Search, Display, Shopping & YouTube campaigns.' },
  { title: 'Meta Ads', description: 'Facebook & Instagram conversion campaigns.' },
  { title: 'Landing Page Optimization', description: 'High-converting page structure & messaging.' },
  { title: 'Lead Tracking', description: 'Pixel, analytics & conversion tracking setup.' },
  { title: 'A/B Testing', description: 'Creative testing for maximum performance.' },
  { title: 'Budget Scaling', description: 'Data-driven scaling strategies.' },
]

const funnelSteps = ['Audience Research', 'Ad Creation', 'Conversion Tracking', 'Scaling & Optimization']

const channels = ['Google Search', 'YouTube Ads', 'Facebook Ads', 'Instagram Ads', 'Remarketing', 'Lead Forms', 'Local Campaigns']

const impactStats = [
  { value: '+280%', label: 'Revenue Growth' },
  { value: '-52%', label: 'Cost Per Lead' },
  { value: '4.8x', label: 'ROAS Average' },
]

const faqItems = [
  { question: 'How soon can I see results?', answer: 'Most campaigns begin producing measurable leads within the first 30 days, with optimization continuing throughout the engagement.' },
  { question: 'Do you manage ad budgets?', answer: 'Yes — we handle campaign budgets, bidding strategies and performance pacing to maximize ROI across platforms.' },
  { question: 'Do you provide creatives?', answer: 'Absolutely. We create ad copy, visuals, landing pages and conversion-focused assets for every campaign.' },
]

export default function PerformanceMarketingPage() {
  return (
    <main className="service-page performance-page dm-page">
      <PageBanner title="Performance Marketing" breadcrumbs={[{ label: 'Services', path: '/services' }, { label: 'Performance Marketing' }]} />

      <section className="service-content section py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5" data-aos="fade-right" data-aos-delay="100">
              <div className="service-img-wrapper" data-aos="fade-right" data-aos-delay="120">
                <img src="/socialmedia.webp" alt="Performance marketing campaigns" className="service-img" />
              </div>
            </div>

            <div className="col-lg-7">
              <div className="row g-4">
                <div className="col-12">
                  <div className="service-description" data-aos="fade-left" data-aos-delay="140">
                    <h2 className="service-desc-title">Performance Marketing That Delivers Measurable Growth</h2>
                    <p className="service-desc-text">
                      We run data-driven advertising campaigns that maximize ROI, generate qualified leads, and scale your business predictably. Every campaign is optimized for measurable performance across search, social, video and retargeting channels.
                    </p>
                    <ul className="service-benefits">
                      <li><i className="bi bi-check-circle-fill"></i> Measurable ROI from every campaign</li>
                      <li><i className="bi bi-check-circle-fill"></i> Full-funnel optimisation across paid channels</li>
                      <li><i className="bi bi-check-circle-fill"></i> Transparent reporting with real-time insights</li>
                      <li><i className="bi bi-check-circle-fill"></i> Strategic budget scaling for sustainable growth</li>
                    </ul>
                    <NavLink to="/contact" className="service-cta-btn mt-4">
                      Get Started <i className="bi bi-arrow-right ms-2"></i>
                    </NavLink>
                  </div>
                </div>
 {/* <div className="col-12">
                  <div className="services-sidebar" data-aos="fade-up" data-aos-delay="200">
                    <div className="sidebar-header">
             
                        <i className="bi bi-rocket-fill"></i>
                      <h3>All Services</h3>
                    </div>
                    <div className="services-list">
                      {services.map((service) => (
                        <NavLink
                          key={service.path}
                          to={service.path}
                          className={`service-link ${service.active ? 'active' : ''}`}
                        >
                          <span className="service-name">{service.name}</span>
                          <i className="bi bi-arrow-right"></i>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">Why Choose Plutuss Digital?</span>
            <h2 className="fw-bold">We Deliver Measurable Growth With Full Transparency</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { title: 'Google Ads Expertise', text: 'Search, YouTube and display campaigns designed to generate qualified leads.' },
              { title: 'Data-Driven Decisions', text: 'Every optimization is based on performance data, not guesswork.' },
              { title: 'Dedicated Campaign Support', text: 'A performance team that communicates clearly and responds fast.' },
              { title: 'Transparent Reporting', text: 'Real-time reporting, conversions tracking and campaign insights.' },
              { title: 'Budget Efficiency', text: 'Smart bid strategies and budget scaling for sustainable ROI.' },
              { title: 'Creative & Landing Pages', text: 'Ad creatives and landing pages built to convert every click.' },
            ].map((item, index) => (
              <div className="col-md-6 col-lg-4" key={item.title} data-aos="fade-up" data-aos-delay={index * 80}>
                <div className="content-card h-100 p-4">
                  <h3 className="h5 mb-3">{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">What We Manage</span>
            <h2 className="fw-bold">What We Manage</h2>
          </div>
          <div className="sequential-card-group">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="sequential-card performance-sequential-card row gx-4 gy-3 align-items-center"
                data-aos="fade-up"
                data-aos-delay={index * 120}
              >
                <div className="col-12 col-md-auto">
                  <div className="seq-num">0{index + 1}.</div>
                </div>
                <div className="col">
                  <div className="seq-body">
                    <div className="seq-tag">MANAGE</div>
                    <h3 className="seq-title">{feature.title}</h3>
                    <p className="seq-desc mb-0">{feature.description}</p>
                  </div>
                </div>
                <div className="col-12 col-md-auto d-flex align-items-center justify-content-center">
                  <a href="/contact" className="seq-card-action" aria-label={`Contact us about ${feature.title}`}>
                    <i className="bi bi-arrow-up-right"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="growth-funnel" className="section py-5">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {funnelSteps.map((step, idx) => (
              <div className="col-md-3" key={step} data-aos="fade-up" data-aos-delay={idx * 80}>
                <div className="content-card h-100 p-4 text-center">
                  <div className="badge rounded-pill mb-3" style={{ padding: '0.6rem 1rem', fontWeight: 700, background: 'rgba(0,191,166,0.12)', color: 'var(--brand-blue)' }}>
                    Step {idx + 1}
                  </div>
                  <h3 className="h5 mb-2">{step}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">Advertising Channels</span>
            <h2 className="fw-bold">Advertising Channels</h2>
          </div>
          <div className="marquee-wrapper" data-aos="fade-up">
            <div className="marquee-track">
              {[...channels, ...channels].map((channel, idx) => (
                <span key={`${channel}-${idx}`} className="channel-pill marquee-item">
                  {channel}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">Impact We Create</span>
            <h2 className="fw-bold">Impact We Create</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {impactStats.map((stat) => (
              <div className="col-md-4" key={stat.label} data-aos="fade-up">
                <div className="content-card h-100 p-4 text-center">
                  <div className="display-6 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>{stat.value}</div>
                  <p className="mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8" data-aos="fade-up">
              <span className="service-section-tag">Frequently Asked Questions</span>
              <h2 className="fw-bold">Frequently Asked Questions</h2>
              <div className="mt-4">
                {faqItems.map((item) => (
                  <details key={item.question} className="mb-3">
                    <summary className="fw-bold mb-2">{item.question}</summary>
                    <p className="mb-0 text-muted">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div className="content-card h-100 p-4">
                <h3 className="fw-bold">Ready To Scale Your Business With Paid Advertising?</h3>
                <p className="text-muted">Talk to our performance team and launch a campaign designed to grow revenue, reduce lead costs and improve conversion efficiency.</p>
                <NavLink to="/contact" className="service-cta-btn mt-3 d-inline-flex align-items-center">
                  Get Free Strategy Call <i className="bi bi-arrow-right ms-2"></i>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section py-5">
        <div className="container text-center" data-aos="fade-up">
          <span className="service-section-tag">Ready to Grow</span>
          <h2 className="fw-bold">Ready To Scale Your Business With Paid Advertising?</h2>
          <p className="text-muted mb-4">Book a call or message our team to start performance advertising that scales.</p>
          <NavLink to="/contact" className="service-cta-btn">
            Get Free Strategy Call <i className="bi bi-arrow-right ms-2"></i>
          </NavLink>
        </div>
      </section>
    </main>
  )
}
