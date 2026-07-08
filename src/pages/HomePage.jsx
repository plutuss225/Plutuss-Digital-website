import IconCard from '../components/IconCard'
import HeroSlider from '../components/HeroSlider'
import OurWork from '../components/OurWork'
import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

export default function HomePage() {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const serviceSlides = [
    {
      title: 'Social Marketing',
      description: 'Promoting your brand through social platforms to engage audiences and drive results.',
      image: '/socialmedia.webp',
      path: '/services/social-media',
    },
    {
      title: 'Branding & Strategy',
      description: 'Building a strong brand identity and planning strategies to achieve business growth.',
      image: '/branding & strategy.webp',
      path: '/services/branding',
    },
    {
      title: 'SEO Marketing',
      description: 'Optimizing your website to rank higher on search engines and drive organic traffic.',
      image: '/seomarketing.webp',
      path: '/services/seo',
    },
    {
      title: 'Content Creation',
      description: 'Creating and sharing valuable content to attract, engage, and convert your audience.',
      image: '/hero-slide-4.png',
      path: '/services/content',
    },
    {
      title: 'Web & Tech Development',
      description: 'Web development and technical solutions to power your online presence.',
      image: '/hero-slide-1.webp',
      path: '/services/web',
    },
    {
      title: 'Performance Marketing',
      description: 'Our performance marketing strategies focus on measurable results. Through platforms like Google Ads, Facebook ',
      image: '/socialmedia.webp',
      path: '/services/performance',
    },
  ]
  
  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % serviceSlides.length)
    }, 3200)
    return () => clearInterval(id)
  }, [paused, serviceSlides.length])

  const values = [
    {
      icon: 'shield-check',
      title: 'Security & Trust',
      text: 'We prioritize the safety of your assets with enterprise-grade security protocols, multi-factor authentication, and continuous monitoring to ensure your investments are always protected.'
    },
    {
      icon: 'lightning-charge',
      title: 'Innovation First',
      text: 'Plutus continuously evolves its platform to harness the latest advancements in blockchain and digital finance, giving you access to cutting-edge tools and market opportunities.'
    },
    {
      icon: 'people',
      title: 'Client-Centric',
      text: 'Our platform is built around your needs. From individual traders to institutional investors, every feature is designed to deliver clarity, control, and confidence in your investment journey.'
    },
  ]

  const stats = [
    { value: '500+', label: 'Happy Clients' },
    { value: '50+', label: 'Projects' },
    { value: '24/7', label: 'Hours of Support' },
    { value: '30+', label: 'Hard Workers' },
  ]

  const testimonials = [
    {
      name: 'Trimortal Ventures',
      role: 'Founder',
      image: '/trimortal-logo.png',
      rating: 5,
      text: 'Plutuss Digital gave us exactly what we needed- a clean, modern website and consistent social media presence. Their strategy and support made a real difference.'
    },
    {
      name: 'Royal Court',
      role: 'CEO',
      image: '/royal-court-logo.png',
      rating: 5,
      text: 'We\'ve seen a great boost in visibility with Plutuss Digital. Their targeted campaigns and social media management helped us attract the right buyers.'
    },
    {
      name: 'Prosumers Solar Pvt. Ltd.',
      role: 'Director',
      image: '/prosumers-logo.png',
      rating: 5,
      text: 'Plutuss Digital transformed our online presence. From web design to social media, everything was handled with creativity and precision. Truly a game-changer!'
    },
  ]

  useEffect(() => {
    const id = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % testimonials.length)
    }, 2500)
    return () => clearInterval(id)
  }, [testimonials.length])

  // Reveal left and right service cards from bottom after mount
  useEffect(() => {
    const cols = document.querySelectorAll('.services-grid .big-service-col');
    const sideIndices = [0, 2];

    const applyReveal = (col) => {
      const card = col.querySelector('.big-service-card')
      if (card) {
        card.classList.remove('reveal-from-bottom')
        // force reflow then add to restart animation
        void card.offsetWidth
        card.classList.add('reveal-from-bottom')
        // also add fallback active class after a short delay to trigger transitions
        setTimeout(() => card.classList.add('active-fallback'), 120)
      }
      const items = Array.from(col.querySelectorAll('.big-service-list ul li'))
      items.forEach((it, idx) => {
        it.classList.remove('reveal-from-bottom-fast')
        void it.offsetWidth
        setTimeout(() => {
          it.classList.add('reveal-from-bottom-fast')
          setTimeout(() => it.classList.add('active-fallback'), 60 + idx * 40)
        }, 80 + idx * 60)
      })
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            applyReveal(e.target)
            obs.unobserve(e.target)
          }
        })
      }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' })

      sideIndices.forEach(i => {
        const col = cols[i]
        if (col) io.observe(col)
      })
      return () => io.disconnect()
    } else {
      // fallback: apply immediately
      sideIndices.forEach(i => {
        const col = cols[i]
        if (col) applyReveal(col)
      })
    }
  }, [])

  const faqItems = [
    {
      question: 'What services does Plutuss Digital offer?',
      answer: 'We offer comprehensive digital marketing services including SEO, social media management, content creation, branding strategy, web development, and PPC campaigns to help your business grow online.'
    },
    {
      question: 'How long does SEO take to show results?',
      answer: 'SEO is a long-term strategy. Typically, you can expect to see initial results within 3-6 months, with significant improvements visible after 6-12 months, depending on competition and your starting point.'
    },
    {
      question: 'Do you provide website design and development?',
      answer: 'Yes, we provide full website design and development services. We create modern, responsive, and user-friendly websites optimized for conversions and search engines.'
    },
    {
      question: 'Can you manage our social media accounts?',
      answer: 'Absolutely! We manage social media accounts across all major platforms including Facebook, Instagram, LinkedIn, and Twitter. We create content, engage with followers, and track performance metrics.'
    },
    {
      question: 'Do you work with small businesses and startups?',
      answer: 'Yes! We work with businesses of all sizes, from startups to established companies. We tailor our services and pricing to fit your budget and business goals.'
    },
  ]

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`bi bi-star${i < Math.floor(rating) ? '-fill' : i < rating ? '-half' : ''}`}></i>
    ))
  }

  const activeTestimonial = testimonials[testimonialIndex] || testimonials[0]

  return (
    <main className="main">
      {/* ── Hero Slider ─────────────────────────────────── */}
      <HeroSlider />

      <section className="hero-partner-strip-section" aria-label="Trusted partners">
        <div className="container">
          <div className="hero-partner-strip">
            <div className="hero-partner-heading">
              <span className="hero-partner-label">Trusted Partners</span>
              <span className="hero-partner-subtitle">Brands that trust our growth-driven work</span>
            </div>
            <div className="hero-partner-track">
              {[...[
                { src: '/royal-court-logo.png', alt: 'Royal Court' },
                { src: '/trimortal-logo.png', alt: 'Trimortal Ventures' },
                { src: '/prosumers-logo.png', alt: 'Prosumers Solar' },
              ], ...[
                { src: '/royal-court-logo.png', alt: 'Royal Court' },
                { src: '/trimortal-logo.png', alt: 'Trimortal Ventures' },
                { src: '/prosumers-logo.png', alt: 'Prosumers Solar' },
              ]].map((logo, index) => (
                <div key={`${logo.alt}-${index}`} className="hero-partner-logo-item">
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────── */}
      <section id="about" className="about section dg-about-section">
        <div className="container" data-aos="fade-up">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <div className="dg-about-media" data-aos="zoom-in" data-aos-delay="100">
                <div className="dg-about-img-wrap">
                  <img src="/about-03.jpg" alt="About Plutus" className="dg-about-img" />
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
              <div className="dg-about-content">
                <span className="dg-about-pill">
                  <i className="bi bi-info-circle-fill me-2"></i> About Us
                </span>

                <h3 className="mb-3 text-dark fw-bold dg-about-title">
                  Smart SEO & Marketing
                  <br />
                  Solutions <span className="fst-italic">for Business</span>
                </h3>

                <p className="text-muted mb-4 dg-about-subtitle">
                  <span className="dg-about-dropcap">W</span>e are a results-driven digital marketing and SEO agency dedicated to helping businesses grow their online presence and attract qualified traffic.
                </p>

                <div className="dg-about-list mb-4">
                  {[
                    'Improve Google rankings and organic traffic',
                    'PPC campaigns for targeted and fast results',
                    'Result-oriented digital marketing strategies',
                    'Conversion Rate Optimization (CRO)',
                  ].map((item, index) => (
                    <div key={item} className="dg-about-list-item" data-aos="fade-up" data-aos-delay={180 + index * 80}>
                      <i className="bi bi-check2-circle"></i>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="dg-about-footer d-flex flex-column flex-sm-row align-items-center gap-3">
                  <a href="/contact" className="dg-about-primary-btn" data-aos="fade-up" data-aos-delay="260">
                    Get More Traffic <i className="bi bi-arrow-right ms-2"></i>
                  </a>

                  <div className="dg-about-phone d-flex align-items-center gap-3" data-aos="fade-up" data-aos-delay="320">
                    <span className="dg-phone-icon">
                      <i className="bi bi-telephone-fill"></i>
                    </span>
                    <div>
                      <div className="fw-semibold">(888) 4567890</div>
                      <small className="text-muted">Speak with our team</small>
                    </div>
                  </div>
                </div>

                {/* <div className="dg-about-circle-badge mt-5" data-aos="fade-up" data-aos-delay="360">
                  <div className="dg-about-circle-inner">
                    <i className="bi bi-rocket-fill"></i>
                  </div>
                  <div className="dg-about-circle-text">ABOUT US • SEOFIN • ABOUT US</div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services (three big cards + sub-row) ───── */}
      <section className="services-offer section py-5">
        <div className="container" data-aos="fade-up">
          <div className="services-header text-center mb-5">
            <span className="section-label">Our Services</span>
            <h2 className="section-title">Digital Growth Services for Every Business</h2>
            <p className="section-description">From strategy to execution, Plutus Digital crafts premium marketing, creative, and web solutions that drive measurable growth.</p>
          </div>
          <div className="services-grid">
              {serviceSlides.map((s, i) => (
                <div className="big-service-col" key={s.title} data-aos="fade-up" data-aos-delay={i * 80}>
                  <div
                    className="big-service-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => window.location.href = s.path}
                  >
                    <div className="big-service-top">
                      <div className="big-service-icon">
                        <img src={s.image} alt={s.title} style={{ width: 72, height: 72, objectFit: 'contain' }} />
                      </div>
                      <h3 className="big-service-title">{s.title}</h3>
                      <p className="big-service-sub">{s.description}</p>
                    </div>

                    <div className="big-service-divider" />

                    <div className="big-service-list p-4">
                      <ul>
                        <li><i className="bi bi-arrow-return-right me-2"></i> Diversity Business</li>
                        <li><i className="bi bi-arrow-return-right me-2"></i> Risk Management</li>
                        <li><i className="bi bi-arrow-return-right me-2"></i> Certificated Company</li>
                      </ul>
                      <span className="big-service-arrow"> <i className="bi bi-arrow-up-right-circle"></i> </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>

      <OurWork />

      {/* ── Reviews From Clients ────────────────────────── */}
      <section className="reviews-section section py-5">
        <div className="review-full-width-pink" />
        <div className="container" data-aos="fade-up">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6" data-aos="fade-up">
              <span className="section-label">Testimonials</span>
              <h2 className="review-heading">What Our Client Say About Us</h2>
              <div className="review-underline" />
              <p className="review-intro">
                Collaboratively actualize excellent schemas without effective models. Synergistically engineer functionalized applications rather than backend e-commerce.
              </p>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="120">
              <div className="review-large-wrap">
                <div className="review-card-stage">
                  <div className="review-card-blank" />
                  {activeTestimonial && (
                    <div className="review-main-card" key={testimonialIndex}>
                      <div className="review-card-header">
                        <div className="review-card-avatar">
                          <img src={activeTestimonial.image} alt={activeTestimonial.name} />
                        </div>
                        <div className="review-card-meta">
                          <h4 className="review-card-name">{activeTestimonial.name}</h4>
                          <div className="review-card-role">{activeTestimonial.role}</div>
                        </div>
                        <div className="review-quote-mark">“”</div>
                      </div>
                      <p className="review-card-text">{activeTestimonial.text}</p>
                      <div className="reviews-dots mt-4 text-center">
                        {testimonials.map((_, i) => (
                          <button key={i} className={`dot ${testimonialIndex === i ? 'active' : ''}`} onClick={() => setTestimonialIndex(i)} aria-label={`Show review ${i + 1}`}></button>
                        ))}
                      </div>
                      <div className="review-plane-decor" />
                    </div>
                  )}
                </div>

                <div className="review-navigation mt-4 d-flex justify-content-center gap-3">
                  <button className="review-arrow prev" onClick={() => setTestimonialIndex((testimonialIndex - 1 + testimonials.length) % testimonials.length)} aria-label="Previous review">‹</button>
                  <button className="review-arrow next" onClick={() => setTestimonialIndex((testimonialIndex + 1) % testimonials.length)} aria-label="Next review">›</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────
      <section id="values" className="values section py-5">
        <div className="container section-title text-center mb-5" data-aos="fade-up">
          <h2 className="fw-bold">Our Values</h2>
          <p className="fs-5 text-muted">What we value most</p>
        </div>
        <div className="container">
          <div className="row gy-4">
            {values.map(({ icon, title, text }) => (
              <IconCard key={title} icon={icon} title={title} text={text} />
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Stats ───────────────────────────────────────────
      <section id="stats" className="stats section py-5">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            {stats.map(({ value, label }) => (
              <div className="col-lg-3 col-md-6" key={label}>
                <div className="stats-item w-100 h-100">
                  <span>{value}</span>
                  <p className="mb-0 fw-semibold text-muted">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Features ────────────────────────────────────────
      <section id="features" className="features section py-5">
        <div className="container section-title text-center mb-5" data-aos="fade-up">
          <h2 className="fw-bold">Features</h2>
          <p className="fs-5 text-muted">Our Advanced Features</p>
        </div>
        <div className="container mb-5">
          <div className="row gy-5 align-items-center">
            <div className="col-xl-6" data-aos="zoom-out" data-aos-delay="100">
              <img
                src="https://plutusdigitalasset.com/assets/img/features.png"
                className="img-fluid"
                alt="Plutus features"
                style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              />
            </div>
            <div className="col-xl-6 d-flex align-items-center">
              <div className="content-card text-start p-4 p-lg-5 w-100">
                <h3 className="mb-3">A streamlined digital asset platform</h3>
                <p className="mb-4 text-muted">
                  Built for secure access, faster execution, and a cleaner user experience across every touchpoint.
                </p>
                <div className="row gy-3">
                  {[
                    { icon: 'shield-lock', text: 'Enterprise-grade security & compliance' },
                    { icon: 'graph-up-arrow', text: 'Real-time analytics & market insights' },
                    { icon: 'arrow-repeat', text: 'Multi-exchange connectivity & execution' },
                    { icon: 'cpu', text: 'Algorithmic trading & portfolio automation' },
                  ].map(({ icon, text }) => (
                    <div className="col-12" key={text}>
                      <div className="feature-box">
                        <i className={`bi bi-${icon}`}></i>
                        <span>{text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* ── FAQ ────────────────────────────────────────────– */}
      <section className="faq-custom section py-5">
        <div className="container" data-aos="fade-up">
          <div className="faq-header text-center mb-5">
            <span className="section-label">FAQ</span>
            <h2 className="fw-bold mt-3">Frequently Asked <span className="text-gradient">Questions</span></h2>
            <p className="text-muted mt-3">Find answers to some of the most common questions about our digital marketing services.</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-9">
              <div className="faq-container">
                {faqItems.map((item, index) => (
                  <div key={index} className={`faq-item ${expandedFAQ === index ? 'active' : ''}`} data-aos="fade-up" data-aos-delay={index * 80}>
                    <div className="faq-header-item" onClick={() => toggleFAQ(index)}>
                      <h4 className="faq-question">{item.question}</h4>
                      <span className="faq-toggle">
                        <i className="bi bi-plus-lg"></i>
                      </span>
                    </div>
                    {expandedFAQ === index && (
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
