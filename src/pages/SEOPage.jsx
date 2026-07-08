import { NavLink } from 'react-router-dom'
import PageBanner from '../components/PageBanner'

export default function SEOPage() {
  return (
    <main className="service-page">
      <PageBanner title="SEO Marketing" breadcrumbs={[{ label: 'Services' }, { label: 'SEO Marketing' }]} />

      {/* Main Content */}
      <section className="service-content section py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* Left: Service Image */}
            <div className="col-lg-7">
              <div className="service-img-wrapper" data-aos="zoom-in" data-aos-delay="80">
                <img src="/seomarketing.webp" alt="SEO Marketing" className="service-img" />
              </div>
            </div>

            {/* Right: Content + Sidebar */}
            <div className="col-lg-5">
              <div className="row g-4">
                {/* Main Description */}
                <div className="col-12">
                  <div className="service-description" data-aos="fade-left" data-aos-delay="140">
                    <h2 className="service-desc-title">What is SEO Marketing?</h2>
                    <p className="service-desc-text">
                      Our SEO services help your business rank higher on search engines like Google. We optimize your website through keyword research, on-page SEO, technical improvements, and strategic link building. The goal is to increase organic traffic, improve search visibility, and bring qualified leads to your business.
                    </p>
                    <ul className="service-benefits">
                      <li><i className="bi bi-check-circle-fill"></i> Improve Google rankings</li>
                      <li><i className="bi bi-check-circle-fill"></i> Drive organic traffic</li>
                      <li><i className="bi bi-check-circle-fill"></i> Increase conversions</li>
                      <li><i className="bi bi-check-circle-fill"></i> Long-term results</li>
                    </ul>
                    <NavLink to="/contact" className="service-cta-btn mt-4" data-aos="fade-up" data-aos-delay="220">
                      Get Started <i className="bi bi-arrow-right ms-2"></i>
                    </NavLink>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">Our SEO Solutions</span>
            <h2 className="fw-bold">SEO Services Built For Growth</h2>
          </div>
          <div className="row g-4">
            {[
              { title: 'SEO Audit', text: 'Technical and content analysis to identify ranking opportunities.', accent: 'pink' },
              { title: 'On-Page SEO', text: 'Optimizing content, meta tags, images and internal site structure.', accent: 'purple' },
              { title: 'Technical SEO', text: 'Speed, mobile and indexation fixes for strong search performance.', accent: 'blue' },
              { title: 'Local SEO', text: 'Google Maps ranking and nearby search visibility growth.', accent: 'green' },
              { title: 'Link Building', text: 'Authority backlinks to improve trust and rankings.', accent: 'pink' },
              { title: 'Reporting', text: 'Monthly performance insights and ranking tracking.', accent: 'purple' },
            ].map((item, index) => (
              <div className="col-md-6 col-lg-4" key={item.title} data-aos="fade-up" data-aos-delay={index * 70}>
                <div className={`social-service-card h-100 p-4 accent-${item.accent}`}>
                  <h3 className="h5 mb-3">{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="content-card p-4 h-100" data-aos="fade-up" data-aos-delay="120">
                <h2 className="fw-bold">Our SEO Process</h2>
                <p>Every campaign follows a structured process to make sure your rankings and traffic keep improving.</p>
                <ol className="service-benefits list-unstyled mt-3">
                  <li><strong>1. Audit</strong> — Website and competitor analysis.</li>
                  <li><strong>2. Keyword Research</strong> — High intent keyword selection.</li>
                  <li><strong>3. Optimization</strong> — Content and technical improvements.</li>
                  <li><strong>4. Authority Building</strong> — Backlinks and citations.</li>
                  <li><strong>5. Tracking</strong> — Reports and continuous optimization.</li>
                </ol>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="service-img-wrapper" data-aos="zoom-in" data-aos-delay="140">
                <img src="/SEO-in-2025.webp" alt="SEO process" className="service-img rounded-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">Why Choose Plutuss Digital?</span>
            <h2 className="fw-bold">Trusted SEO Partners For Your Business</h2>
          </div>
          <div className="row g-4">
            {[
              { title: 'Proven Experience', text: 'Handled high-visibility brands and profiles with measurable growth.' },
              { title: 'Local Market Expertise', text: 'Pune, PCMC and Maharashtra audience-first strategies.' },
              { title: 'Transparent Reporting', text: 'Clear monthly insights with ranking and traffic updates.' },
              { title: 'Fast Execution', text: 'Quick implementation with agile optimization cycles.' },
              { title: 'Ethical Marketing', text: 'Safe, compliant strategies for long-term brand stability.' },
              { title: 'Dedicated Support', text: 'Direct communication and responsive client service.' },
            ].map((item, index) => (
              <div className="col-md-6 col-lg-4" key={item.title} data-aos="fade-up" data-aos-delay={index * 70}>
                <div className="content-card h-100 p-4" data-aos="fade-up" data-aos-delay={index * 80}>
                  <h3 className="h5 mb-3">{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">Benefits Of SEO</span>
            <h2 className="fw-bold">SEO Benefits For Your Business</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { title: 'Higher Google Rankings', icon: '🚀' },
              { title: 'Increased Website Traffic', icon: '📈' },
              { title: 'Quality Lead Generation', icon: '🎯' },
              { title: 'Strong Local Visibility', icon: '📍' },
              { title: 'High ROI Marketing', icon: '💰' },
              { title: 'Brand Authority', icon: '🏆' },
            ].map((item, index) => (
              <div className="col-md-6 col-lg-4" key={item.title} data-aos="fade-up" data-aos-delay={index * 70}>
                <div className="content-card h-100 p-4 text-center" data-aos="fade-up" data-aos-delay={index * 80}>
                  <div className="display-6 mb-3">{item.icon}</div>
                  <h3 className="h5">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5">
        <div className="container text-center" data-aos="fade-up">
          <span className="service-section-tag">Want More Traffic?</span>
          <h2 className="fw-bold">Let Our SEO Experts Grow Your Online Visibility</h2>
          <p className="text-muted mb-4">Start ranking higher and attracting qualified customers with a data-led SEO strategy.</p>
          <NavLink to="/contact" className="service-cta-btn" data-aos="fade-up" data-aos-delay="160">
            Start SEO Today <i className="bi bi-arrow-right ms-2"></i>
          </NavLink>
        </div>
      </section>
    </main>
  )
}
