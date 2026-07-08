import { NavLink } from 'react-router-dom'
import PageBanner from '../components/PageBanner'

export default function ContentCreationPage() {
  const services = [
    { name: 'SEO Marketing', path: '/services/seo', icon: '📊' },
    { name: 'Content Marketing', path: '/services/content', active: true, icon: '📝' },
    { name: 'Social Marketing', path: '/services/social-media', icon: '👥' },
    { name: 'PPC Advertising', path: '/services/branding', icon: '🎯' },
  ]

  return (
    <main className="service-page">
      <PageBanner title="Content Creation" breadcrumbs={[{ label: 'Services', path: '/services' }, { label: 'Content Creation' }]} />

      {/* Main Content */}
      <section className="service-content section py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* Left: Service Image */}
            <div className="col-lg-7">
              <div className="service-img-wrapper" data-aos="fade-up">
                <img src="/hero-slide-4.png" alt="Content Creation" className="service-img" />
              </div>
            </div>

            {/* Right: Content + Sidebar */}
            <div className="col-lg-5">
              <div className="row g-4">
                {/* Main Description */}
                <div className="col-12">
                  <div className="service-description" data-aos="fade-up" data-aos-delay="100">
                    <h2 className="service-desc-title">Compelling Content Strategy</h2>
                    <p className="service-desc-text">
                      Quality content is the backbone of digital marketing. Our creative team produces engaging, SEO-optimized content that attracts, engages, and converts your target audience.
                    </p>
                    <p className="service-desc-text">
                      From blog posts and articles to videos and infographics, we create diverse content across all formats to establish your authority and drive results.
                    </p>
                    <ul className="service-benefits">
                      <li><i className="bi bi-check-circle-fill"></i> Blog posts & articles</li>
                      <li><i className="bi bi-check-circle-fill"></i> Video content creation</li>
                      <li><i className="bi bi-check-circle-fill"></i> Infographics & visuals</li>
                      <li><i className="bi bi-check-circle-fill"></i> Content distribution</li>
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
            <span className="service-section-tag">Our Creative Work</span>
            <h2 className="fw-bold">Creative Content That Gets Noticed</h2>
          </div>

          <div className="creative-work-slider mb-5" data-aos="fade-up">
            <div className="creative-work-track">
              {['/creative1.jpeg', '/creative2.jpeg', '/craetive3.jpeg', '/craetive4.jpeg'].map((src, index) => (
                <div className="creative-work-slide" key={`slide-${index}`}>
                  <img src={src} alt="Creative work" />
                </div>
              ))}
              {['/creative1.jpeg', '/creative2.jpeg', '/craetive3.jpeg', '/craetive4.jpeg'].map((src, index) => (
                <div className="creative-work-slide" key={`slide-dup-${index}`}>
                  <img src={src} alt="Creative work" />
                </div>
              ))}
            </div>
          </div>

          <div className="row g-4 creative-work-cards" data-aos="fade-up" data-aos-delay="100">
            {[
              { title: 'High-Impact Visuals', text: 'Creative designs and videos built to stop audiences mid-scroll and deliver your message clearly.' },
              { title: 'Social-Ready Content', text: 'Content formatted for reels, stories, posts and ads that perform across Instagram, Facebook, and YouTube.' },
              { title: 'Performance Messaging', text: 'Copy, headlines and creative direction aligned to conversions and business goals.' },
              { title: 'Campaign-Led Creative', text: 'Assets designed not just for looks, but to support campaign objectives and audience response.' },
            ].map((item, index) => (
              <div className="col-md-6 col-lg-3" key={item.title}>
                <div className="content-card h-100 creative-work-card">
                  <h3 className="creative-work-card-title">{item.title}</h3>
                  <p className="creative-work-card-text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-5">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="service-section-tag">Designed For Impact</span>
            <h2 className="fw-bold">Creative Services Built To Convert</h2>
          </div>
          <div className="row g-4">
            {[
              { title: 'Branding Creatives', text: 'High-quality posters, banners, templates and campaign visuals.' },
              { title: 'Reels & Video', text: 'Short-form videos optimized for engagement and reach.' },
              { title: 'Copywriting', text: 'Captions and content that convert attention into action.' },
              { title: 'Photography Direction', text: 'Visual planning and shoot guidance for brand storytelling.' },
            ].map((item, index) => (
              <div className="col-md-6 col-lg-3" key={item.title} data-aos="fade-up" data-aos-delay={index * 80}>
                <div className="content-card h-100 p-4 text-center">
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
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-9 text-center" data-aos="fade-up">
              <span className="service-section-tag">Our Content Services</span>
              <h2 className="fw-bold">What We Deliver</h2>
            </div>
            <div className="col-xl-10 col-lg-11" data-aos="fade-up" data-aos-delay="100">
              <div className="sequential-card-group">
                {[
                  { num: '01', tag: 'CONTENT', title: 'Graphic Design', client: 'PLUTUSS DIGITAL', value: '$145', desc: 'Social media posters, campaign visuals, brand templates and corporate creatives.', img: '/creative1.jpeg' },
                  { num: '02', tag: 'VIDEO', title: 'Video Editing', client: 'PLUTUSS DIGITAL', value: '$145', desc: 'Reels editing, transitions, promotional videos and sound design for higher engagement.', img: '/creative2.jpeg' },
                  { num: '03', tag: 'PHOTO', title: 'Photography', client: 'PLUTUSS DIGITAL', value: '$145', desc: 'Product direction, lifestyle shoots, brand imagery and visual storytelling for your content.', img: '/craetive3.jpeg' },
                  { num: '04', tag: 'COPY', title: 'Copywriting', client: 'PLUTUSS DIGITAL', value: '$145', desc: 'Captions, ad copy, content planning and Marathi + English messaging for campaigns.', img: '/craetive4.jpeg' },
                ].map((item, index) => (
                  <div key={item.title} className="sequential-card row gx-4 gy-3 align-items-center" data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="seq-hover-icon" aria-hidden="true">
                      <i className="bi bi-arrow-up-right"></i>
                    </div>
                    <div className="col-12 col-md-auto">
                      <div className="seq-num">{item.num}.</div>
                    </div>
                    <div className="col">
                      <div className="seq-body">
                        <div className="seq-tag">{item.tag}</div>
                        <h3 className="seq-title">{item.title}</h3>
                        <div className="seq-meta">
                          <span>CLIENT NAME: {item.client}</span>
                          <span>VALUE: {item.value}</span>
                        </div>
                        <p className="seq-desc mb-0">{item.desc}</p>
                      </div>
                    </div>
                    <div className="col-12 col-md-auto d-flex flex-column align-items-center justify-content-between seq-card-side">
                      <img src={item.img} alt={item.title} className="seq-card-img mb-3" />
                      <a href="/contact" className="seq-card-action" aria-label="Contact us about content services">
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

      <section className="section py-5">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6" data-aos="fade-right">
              <h2 className="fw-bold">Creative Workflow That Delivers</h2>
              <p>We follow a clear content process so every creative asset is on-brand and performance-ready.</p>
              <ul className="service-benefits mt-4">
                <li><i className="bi bi-check-circle-fill"></i> Brief: Understand your brand and objective.</li>
                <li><i className="bi bi-check-circle-fill"></i> Concept: Idea, storyboard and planning.</li>
                <li><i className="bi bi-check-circle-fill"></i> Design: Visual creation and refinement.</li>
                <li><i className="bi bi-check-circle-fill"></i> Delivery: Final export and publishing support.</li>
              </ul>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <img src="/why-choose-us.png" alt="Creative workflow" className="service-img rounded-4" />
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5 bg-light">
        <div className="container text-center" data-aos="fade-up">
          <span className="service-section-tag">What Makes Us Different</span>
          <h2 className="fw-bold">Creative Strategy With Performance Focus</h2>
          <div className="row g-4 justify-content-center mt-4">
            {[
              { title: 'Niche Expertise', text: 'Political branding, real estate marketing and local business creatives.' },
              { title: 'Creative Excellence', text: 'In-house designers and editors delivering premium quality visuals.' },
              { title: 'Performance Focused', text: 'Every asset aligns with measurable growth objectives.' },
              { title: 'Fast Turnaround', text: 'Quick delivery without compromising quality.' },
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

      <section className="section py-5 text-center">
        <div className="container" data-aos="fade-up">
          <span className="service-section-tag">Let’s Create Something Powerful</span>
          <h2 className="fw-bold">Turn Ideas Into High-Performing Content</h2>
          <p className="text-muted mb-4">Work with our creative team to build content that engages, converts and grows your brand.</p>
          <NavLink to="/contact" className="service-cta-btn">
            Get Started <i className="bi bi-arrow-right ms-2"></i>
          </NavLink>
        </div>
      </section>
    </main>
  )
}
