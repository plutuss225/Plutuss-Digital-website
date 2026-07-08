import { NavLink } from 'react-router-dom'
import PageBanner from '../components/PageBanner'

export default function WebDevelopmentPage() {
  const services = [
    { name: 'SEO Marketing', path: '/services/seo', icon: '📊' },
    { name: 'Content Marketing', path: '/services/content', icon: '📝' },
    { name: 'Social Marketing', path: '/services/social-media', icon: '👥' },
    { name: 'Web & Tech Development', path: '/services/web', active: true, icon: '💻' },
  ]

  return (
    <main className="service-page">
      <PageBanner title="Web Development" breadcrumbs={[{ label: 'Services', path: '/services' }, { label: 'Web Development' }]} />

      {/* Main Content */}
      <section className="service-content section py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* Left: Service Image */}
            <div className="col-lg-7">
              <div className="service-img-wrapper" data-aos="fade-up">
                <img src="/hero-slide-1.webp" alt="Web Development" className="service-img" />
              </div>
            </div>

            {/* Right: Content + Sidebar */}
            <div className="col-lg-5">
              <div className="row g-4">
                {/* Main Description */}
                <div className="col-12">
                  <div className="service-description" data-aos="fade-up" data-aos-delay="100">
                    <h2 className="service-desc-title">Modern Web Solutions</h2>
                    <p className="service-desc-text">
                      We build fast, secure, and scalable websites and web applications that deliver exceptional user experiences. Our developers use the latest technologies to create solutions tailored to your business needs.
                    </p>
                    <p className="service-desc-text">
                      From responsive websites to custom applications, we develop digital solutions that drive business growth and user satisfaction.
                    </p>
                    <ul className="service-benefits">
                      <li><i className="bi bi-check-circle-fill"></i> Responsive web design</li>
                      <li><i className="bi bi-check-circle-fill"></i> Custom web applications</li>
                      <li><i className="bi bi-check-circle-fill"></i> E-commerce solutions</li>
                      <li><i className="bi bi-check-circle-fill"></i> Performance optimization</li>
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
            <span className="service-section-tag">What We Do</span>
            <h2 className="fw-bold">Modern Web Solutions For Every Business</h2>
          </div>
          <div className="row g-4">
            {[
              { title: 'Custom Websites', description: 'Tailor-made designs that reflect your brand identity.' },
              { title: 'Fast Performance', description: 'Optimized speed, security and stability across every site.' },
              { title: 'Mobile Friendly', description: 'Perfect experience on all devices and screen sizes.' },
              { title: 'E-commerce Stores', description: 'Online stores with payment and product management.' },
              { title: 'Landing Pages', description: 'Conversion-focused pages for campaigns and promos.' },
              { title: 'Web Applications', description: 'Custom systems built for your unique business workflows.' },
            ].map((item, index) => (
              <div className="col-md-6" key={item.title} data-aos="fade-up" data-aos-delay={index * 70}>
                <div className="content-card h-100 p-4">
                  <h3 className="h5 mb-3">{item.title}</h3>
                  <p className="mb-0">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-9 text-center" data-aos="fade-up">
              <h2 className="fw-bold typing-text">Types Of Websites We Build</h2>
              <p>From business brochure sites to campaign platforms and custom applications, we build websites that drive results.</p>
            </div>
            <div className="col-xl-10 col-lg-11">
              <div className="sequential-card-group">
                {[
                  { num: '01', tag: 'BUSINESS', title: 'Business Websites', client: 'ROMAN WILLIMES', value: '$145', desc: 'Professional brochure sites for service-based and corporate brands.', img: '/hero-bg-1.jpg' },
                  { num: '02', tag: 'E-COMMERCE', title: 'E-commerce Stores', client: 'ROMAN WILLIMES', value: '$145', desc: 'Secure stores with product management, payments and analytics.', img: '/hero-bg-1.jpg' },
                  { num: '03', tag: 'LANDING', title: 'Landing Pages', client: 'ROMAN WILLIMES', value: '$145', desc: 'Conversion-focused pages tailored for campaigns and promotions.', img: '/hero-bg-1.jpg' },
                  { num: '04', tag: 'PORTFOLIO', title: 'Portfolio Websites', client: 'ROMAN WILLIMES', value: '$145', desc: 'Visually polished portfolio sites to showcase brands and talent.', img: '/hero-bg-1.jpg' },
                  { num: '05', tag: 'CAMPAIGN', title: 'Political Campaign Sites', client: 'ROMAN WILLIMES', value: '$145', desc: 'Strategic campaign websites built for voter engagement and advocacy.', img: '/hero-bg-1.jpg' },
                  { num: '06', tag: 'APPLICATION', title: 'Custom Web Applications', client: 'ROMAN WILLIMES', value: '$145', desc: 'Custom-built web systems designed for your business workflows.', img: '/hero-bg-1.jpg' },
                ].map((c, i) => (
                  <div key={c.num} className="sequential-card row gx-4 gy-3 align-items-center" data-aos="fade-up" data-aos-delay={i * 120}>
                    <div className="seq-hover-icon" aria-hidden="true">
                      <i className="bi bi-arrow-up-right"></i>
                    </div>
                    <div className="col-12 col-md-auto">
                      <div className="seq-num">{c.num}.</div>
                    </div>
                    <div className="col">
                      <div className="seq-body">
                        <div className="seq-tag">{c.tag}</div>
                        <h3 className="seq-title">{c.title}</h3>
                        <div className="seq-meta">
                          <span>CLIENT NAME: {c.client}</span>
                          <span>VALUE: {c.value}</span>
                        </div>
                        <p className="seq-desc mb-0">{c.desc}</p>
                      </div>
                    </div>
                    <div className="col-12 col-md-auto d-flex flex-column align-items-center justify-content-between seq-card-side">
                      <img src={c.img} alt={c.title} className="seq-card-img mb-3" />
                      <a href="/contact" className="seq-card-action" aria-label="Contact us about website development">
                        <i className="bi bi-arrow-up-right"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">Our Process</span>
            <h2 className="fw-bold">Development Workflow</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { title: 'Discuss Requirements', desc: 'Understand your goals, users and project scope.' },
              { title: 'Design & Development', desc: 'Create UI/UX and build the website with quality code.' },
              { title: 'Testing & Optimization', desc: 'Secure, speed and compatibility testing before launch.' },
              { title: 'Launch & Support', desc: 'Deploy live with continued support and updates.' },
            ].map((item, index) => (
              <div className="col-md-6 col-lg-3" key={item.title} data-aos="fade-up" data-aos-delay={index * 70}>
                <div className="content-card h-100 p-4 text-center">
                  <h3 className="h5 mb-3">{item.title}</h3>
                  <p className="mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5">
        <div className="container text-center" data-aos="fade-up">
          <span className="service-section-tag">Why Plutuss Digital</span>
          <h2 className="fw-bold">Web Projects Built For Results</h2>
          <div className="row g-4 justify-content-center mt-4">
            {[
              { title: 'SEO Optimized Structure', text: 'Clean architecture that ranks and converts.' },
              { title: 'Mobile Responsive Design', text: 'Perfect experiences across phones, tablets and desktops.' },
              { title: 'Fast Delivery', text: 'Quick project turnaround without compromising quality.' },
              { title: 'Local Support', text: 'Affordable packages with local Pune support.' },
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

      <section className="section py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8" data-aos="fade-up">
              <span className="service-section-tag">Frequently Asked Questions</span>
              <h2 className="fw-bold">Web Development FAQ</h2>
              <div className="mt-4">
                {[
                  { question: 'How long does a website take to build?', answer: 'Most websites take between 1–4 weeks depending on complexity.' },
                  { question: 'Will my website be mobile friendly?', answer: 'Yes, all websites we build are fully responsive for all devices.' },
                  { question: 'Can you redesign my existing website?', answer: 'Yes, we can redesign outdated websites with modern UI/UX.' },
                ].map(item => (
                  <details key={item.question} className="mb-3">
                    <summary className="fw-bold mb-2">{item.question}</summary>
                    <p className="mb-0 text-muted">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div className="content-card h-100 p-4">
                <h3 className="fw-bold">Ready To Build Your Website?</h3>
                <p className="text-muted">Let’s discuss your website requirements and launch a digital presence that drives leads.</p>
                <NavLink to="/contact" className="service-cta-btn mt-3 d-inline-flex align-items-center">
                  Request Quote <i className="bi bi-arrow-right ms-2"></i>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5 text-center">
        <div className="container" data-aos="fade-up">
          <span className="service-section-tag">Ready To Build Your Website?</span>
          <h2 className="fw-bold">Launch A Website That Works For Your Business</h2>
          <p className="text-muted mb-4">Start with a strategy-led website designed for growth and conversions.</p>
          <NavLink to="/contact" className="service-cta-btn">
            Request Quote <i className="bi bi-arrow-right ms-2"></i>
          </NavLink>
        </div>
      </section>
    </main>
  )
}
