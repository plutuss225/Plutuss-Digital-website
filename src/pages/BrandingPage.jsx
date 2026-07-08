import { NavLink } from 'react-router-dom'
import PageBanner from '../components/PageBanner'

export default function BrandingPage() {
  const services = [
    { name: 'SEO Marketing', path: '/services/seo', icon: '📊' },
    { name: 'Content Marketing', path: '/services/content', icon: '📝' },
    { name: 'Social Marketing', path: '/services/social-media', icon: '👥' },
    { name: 'Branding & Design', path: '/services/branding', active: true, icon: '🎯' },
  ]

  return (
    <main className="service-page">
      <PageBanner title="Branding & Design" breadcrumbs={[{ label: 'Services', path: '/services' }, { label: 'Branding & Design' }]} />

      {/* Main Content */}
      <section className="service-content section py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* Left: Service Image */}
            <div className="col-lg-7">
              <div className="service-img-wrapper" data-aos="fade-up">
                <img src="/branding & strategy.webp" alt="Branding & Design" className="service-img" />
              </div>
            </div>

            {/* Right: Content + Sidebar */}
            <div className="col-lg-5">
              <div className="row g-4">
                {/* Main Description */}
                <div className="col-12">
                  <div className="service-description" data-aos="fade-up" data-aos-delay="100">
                    <h2 className="service-desc-title">Build Your Strong Brand</h2>
                    <p className="service-desc-text">
                      A strong brand sets you apart from competitors and creates lasting connections with customers. We develop comprehensive branding strategies that reflect your company's values and resonate with your target audience.
                    </p>
                    <p className="service-desc-text">
                      From logo design to brand guidelines and visual identity, we create cohesive, memorable brands that drive business growth and customer loyalty.
                    </p>
                    <ul className="service-benefits">
                      <li><i className="bi bi-check-circle-fill"></i> Logo & brand identity</li>
                      <li><i className="bi bi-check-circle-fill"></i> Brand strategy & positioning</li>
                      <li><i className="bi bi-check-circle-fill"></i> Visual design guidelines</li>
                      <li><i className="bi bi-check-circle-fill"></i> Brand consistency</li>
                    </ul>
                    <NavLink to="/contact" className="service-cta-btn mt-4">
                      Get Started <i className="bi bi-arrow-right ms-2"></i>
                    </NavLink>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">What Makes Our Branding Powerful</span>
            <h2 className="fw-bold">Branding That Connects & Converts</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { title: 'Strategy Driven Design', text: 'We build brands with intention, purpose and customer connection.' },
              { title: 'Creative Excellence', text: 'Visual identity, logos and campaign assets designed to stand out.' },
              { title: 'Fast Turnaround', text: 'Quick delivery without sacrificing quality or consistency.' },
              { title: 'Personalized Support', text: 'Dedicated guidance through every branding decision.' },
            ].map((item, index) => (
              <div className="col-md-6 col-lg-3" key={item.title} data-aos="fade-up" data-aos-delay={index * 70}>
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
            <span className="service-section-tag">Visual Brand Showcase</span>
            <h2 className="fw-bold">Brand Assets That Reflect Your Identity</h2>
          </div>

          <div className="branding-showcase-slider mb-5" data-aos="fade-up">
            <div className="branding-showcase-track">
              {['/brand1.jpeg', '/brand2.png', '/brand3.jpeg', '/brand5.jpeg'].map((src, index) => (
                <div className="branding-showcase-slide" key={`slide-${index}`}>
                  <img src={src} alt="Brand showcase" />
                </div>
              ))}
              {['/brand1.jpeg', '/brand2.png', '/brand3.jpeg', '/brand5.jpeg'].map((src, index) => (
                <div className="branding-showcase-slide" key={`slide-copy-${index}`}>
                  <img src={src} alt="Brand showcase" />
                </div>
              ))}
            </div>
          </div>

          <div className="row g-4 branding-showcase-cards" data-aos="fade-up" data-aos-delay="100">
            {[
              { title: 'Logo Systems', text: 'Clean, memorable logos and brand marks that work across digital and print.' },
              { title: 'Color & Typography', text: 'Polished palettes and type systems that strengthen recognition and tone.' },
              { title: 'Campaign Creatives', text: 'Posters, banners and visuals designed for high engagement and recall.' },
              { title: 'Brand Guidelines', text: 'A consistent brand playbook for every touchpoint, online and offline.' },
            ].map((item, index) => (
              <div className="col-md-6 col-lg-3" key={item.title}>
                <div className="content-card h-100 p-4 branding-showcase-card">
                  <h3 className="branding-showcase-card-title">{item.title}</h3>
                  <p className="branding-showcase-card-text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">Branding Services</span>
            <h2 className="fw-bold">Complete Branding Services</h2>
          </div>
          <div className="row g-4">
            {[
              { title: 'Logo Design', text: 'Unique brand logos crafted for recognition and trust.', accent: 'pink' },
              { title: 'Brand Identity', text: 'Colour, typography and visual systems for consistency.', accent: 'purple' },
              { title: 'Posters & Banners', text: 'Campaign and promotional creative for offline and online channels.', accent: 'blue' },
              { title: 'Political Branding', text: 'High-impact campaign visuals for leaders and activists.', accent: 'green' },
            ].map((item, index) => (
              <div className="col-sm-6 col-lg-3" key={item.title} data-aos="fade-up" data-aos-delay={index * 90}>
                <div className={`social-service-card h-100 p-4 accent-${item.accent}`}>
                  <h3 className="h5 mb-3">{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5 text-center">
        <div className="container" data-aos="fade-up">
          <span className="service-section-tag">Ready To Build A Powerful Brand?</span>
          <h2 className="fw-bold">Create An Identity That Stands Out</h2>
          <p className="text-muted mb-4">From logos to campaign visuals, we create branding that makes an impact.</p>
          <NavLink to="/contact" className="service-cta-btn">
            Get Started <i className="bi bi-arrow-right ms-2"></i>
          </NavLink>
        </div>
      </section>
    </main>
  )
}
