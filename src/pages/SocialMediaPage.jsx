import { NavLink } from 'react-router-dom'
import PageBanner from '../components/PageBanner'

export default function SocialMediaPage() {
  const services = [
    { name: 'SEO Marketing', path: '/services/seo', icon: '📊' },
    { name: 'Content Marketing', path: '/services/content', icon: '📝' },
    { name: 'Social Marketing', path: '/services/social-media', active: true, icon: '👥' },
    { name: 'PPC Advertising', path: '/services/branding', icon: '🎯' },
  ]

  return (
    <main className="service-page">
      <PageBanner title="Social Media Marketing" breadcrumbs={[{ label: 'Services', path: '/services' }, { label: 'Social Media' }]} />

      {/* Main Content */}
      <section className="service-content section py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* Left: Service Image */}
            <div className="col-lg-7">
              <div className="service-img-wrapper" data-aos="fade-up">
                <img src="/socialmedia.webp" alt="Social Media Marketing" className="service-img" />
              </div>
            </div>

            {/* Right: Content + Sidebar */}
            <div className="col-lg-5">
              <div className="row g-4">
                {/* Main Description */}
                <div className="col-12">
                  <div className="service-description" data-aos="fade-up" data-aos-delay="100">
                    <h2 className="service-desc-title">Social Media Marketing Strategy</h2>
                    <p className="service-desc-text">
                      Leverage the power of social media to connect with your audience, build brand loyalty, and drive sales. Our social media marketing experts create engaging content and strategies tailored to your business goals.
                    </p>
                    <p className="service-desc-text">
                      From Facebook and Instagram to LinkedIn and TikTok, we manage your social presence across all major platforms to maximize engagement and reach.
                    </p>
                    <ul className="service-benefits">
                      <li><i className="bi bi-check-circle-fill"></i> Increase brand awareness</li>
                      <li><i className="bi bi-check-circle-fill"></i> Engage your audience</li>
                      <li><i className="bi bi-check-circle-fill"></i> Drive website traffic</li>
                      <li><i className="bi bi-check-circle-fill"></i> Build community</li>
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
            <span className="service-section-tag">Why Choose Plutuss Digital?</span>
            <h2 className="fw-bold">Trusted Social Media Marketing</h2>
          </div>
          <div className="row g-4">
            {[
              { title: 'Proven Industry Experience', text: 'We manage political leaders, real estate brands and growing businesses with consistent credibility.', accent: 'pink' },
              { title: 'Strategy Driven Marketing', text: 'Campaigns backed by research, analytics and clear business objectives.', accent: 'purple' },
              { title: 'In-House Creative Team', text: 'Designers, editors and marketers work together to deliver powerful visuals.', accent: 'blue' },
              { title: 'Transparent Reporting', text: 'Monthly performance reports with reach, engagement and ROI tracking.', accent: 'green' },
              { title: 'Personalized Support', text: 'Direct communication, fast response and customised solutions.', accent: 'pink' },
              { title: 'Local Market Expertise', text: 'Pune, PCMC and Maharashtra audience-first social strategies.', accent: 'purple' },
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

      <section className="section py-5">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">What We Offer</span>
            <h2 className="fw-bold">Social Media Marketing Services</h2>
          </div>
          <div className="row g-4">
            {[
              { title: 'Social Media Management', items: ['Content planning & posting', 'Profile optimization', 'Caption writing', 'Community engagement'] },
              { title: 'Creative Production', items: ['Graphic design & posters', 'Reels & video editing', 'Brand visuals', 'Campaign creatives'] },
              { title: 'Growth Strategy', items: ['Hashtag research', 'Reach optimization', 'Audience growth planning', 'Performance analytics'] },
              { title: 'Paid Advertising', items: ['Facebook & Instagram ads', 'Lead generation', 'Local targeting', 'ROI reporting'] },
            ].map((item, index) => (
              <div className="col-sm-6 col-lg-3" key={item.title} data-aos="fade-up" data-aos-delay={index * 80}>
                <div className="social-service-card h-100 p-4 accent-purple">
                  <h3 className="h5 mb-3">{item.title}</h3>
                  <ul className="social-service-list mb-0">
                    {item.items.map((line) => (
                      <li key={line}><span>{line}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">Our Process</span>
            <h2 className="fw-bold">Simple, Transparent Social Media Workflow</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { step: 'Goal Understanding', desc: 'We understand your business goals, audience and growth expectations.' },
              { step: 'Strategy Planning', desc: 'Create a content roadmap, posting plan and engagement strategy.' },
              { step: 'Content Creation', desc: 'Design creatives, reels, captions and branding assets.' },
              { step: 'Posting & Growth', desc: 'Publish consistently and optimize interactions.' },
              { step: 'Reporting', desc: 'Provide monthly insights and performance improvements.' },
            ].map((item, index) => (
              <div className="col-md-6 col-lg-4" key={item.step} data-aos="fade-up" data-aos-delay={index * 70}>
                <div className="content-card h-100 p-4">
                  <h3 className="h5 mb-3">{item.step}</h3>
                  <p className="mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5 text-center">
        <div className="container" data-aos="fade-up">
          <span className="service-section-tag">Ready To Boost Your Social Presence?</span>
          <h2 className="fw-bold">Partner With Plutuss Digital For Better Engagement</h2>
          <p className="text-muted mb-4">Grow your brand with creative content, community building and performance-led posting.</p>
          <NavLink to="/contact" className="service-cta-btn">
            Start Now <i className="bi bi-arrow-right ms-2"></i>
          </NavLink>
        </div>
      </section>
    </main>
  )
}
