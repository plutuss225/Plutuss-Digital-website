import { NavLink } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import ClientLogoSection from '../components/ClientLogoSection'
import { useEffect } from 'react'

const themeColors = {
  brandBlue: '#1B4F9C',
  brandNavy: '#0A1F2E',
  brandTeal: '#00BFA6',
  brandGreen: '#16A34A',
}

const teamMembers = [
  {
    name: 'Rahul Sharma',
    role: 'Founder & CEO',
    bio: 'Visionary leader with 12+ years driving digital growth for 200+ brands across India.',
    avatar: 'RS',
    color: themeColors.brandBlue,
    linkedin: '#',
  },
  {
    name: 'Priya Mehta',
    role: 'Head of Strategy',
    bio: 'Expert strategist specializing in brand positioning and high-impact marketing campaigns.',
    avatar: 'PM',
    color: themeColors.brandNavy,
    linkedin: '#',
  },
  {
    name: 'Amit Kulkarni',
    role: 'Creative Director',
    bio: 'Award-winning creative professional who transforms ideas into compelling visual narratives.',
    avatar: 'AK',
    color: themeColors.brandTeal,
    linkedin: '#',
  },
  {
    name: 'Sneha Patil',
    role: 'SEO & Growth Lead',
    bio: 'Data-driven SEO specialist with a track record of 3x organic traffic growth for clients.',
    avatar: 'SP',
    color: themeColors.brandBlue,
    linkedin: '#',
  },
]

const values = [
  {
    icon: 'bi-lightbulb-fill',
    title: 'Innovation First',
    desc: 'We embrace the latest digital trends and technologies to keep your brand ahead of the curve.',
    color: themeColors.brandBlue,
  },
  {
    icon: 'bi-shield-fill-check',
    title: 'Trust & Transparency',
    desc: 'Every campaign, every report — full transparency so you always know your ROI.',
    color: themeColors.brandNavy,
  },
  {
    icon: 'bi-graph-up-arrow',
    title: 'Results Driven',
    desc: "We measure success by your growth. Numbers don't lie — and ours speak for themselves.",
    color: themeColors.brandTeal,
  },
  {
    icon: 'bi-people-fill',
    title: 'Client Partnership',
    desc: 'We treat every client as a long-term partner. Your success is our success.',
    color: themeColors.brandBlue,
  },
  {
    icon: 'bi-stars',
    title: 'Creative Excellence',
    desc: 'Exceptional creative work that captures attention, sparks emotion, and drives action.',
    color: themeColors.brandGreen,
  },
  {
    icon: 'bi-clock-history',
    title: 'On-Time Delivery',
    desc: 'Deadlines matter. We plan meticulously and always deliver on time, every time.',
    color: themeColors.brandNavy,
  },
]

const stats = [
  { number: '200+', label: 'Happy Clients' },
  { number: '500+', label: 'Projects Completed' },
  { number: '8+', label: 'Years Experience' },
  { number: '98%', label: 'Client Retention' },
]

const milestones = [
  { year: '2016', title: 'Founded', desc: 'Plutuss Digital was born with a mission to democratize digital marketing for Indian businesses.' },
  { year: '2018', title: 'First 50 Clients', desc: 'Rapid growth fueled by word-of-mouth and exceptional results. Expanded team to 15 members.' },
  { year: '2020', title: 'Full-Service Launch', desc: 'Launched complete digital suite — SEO, social media, branding, content creation & web development.' },
  { year: '2022', title: 'Award Recognition', desc: 'Recognized as Top Digital Marketing Agency in Maharashtra for 2 consecutive years.' },
  { year: '2024', title: '200+ Brands Served', desc: 'Now proudly serving 200+ brands nationwide, from startups to enterprise companies.' },
]

const workSteps = [
  { title: 'Technical Audit', desc: 'Monotonectally optimize granular quality vectors vis-a-vis interdependent.' },
  { title: 'Technical SEO', desc: 'Completely synthesize one-to-one interfaces vis-a-vis client-focused alignments.' },
  { title: 'Select Keywords', desc: 'Progressively streamline cooperative sources whereas stand-alone channels.' },
  { title: 'Demographics', desc: 'Objectively underwhelm one-to-one deliverables whereas impactful solutions.' },
]

const clientLogos = [
  '/clients-logo-01.png','/clients-logo-02.png','/clients-logo-03.png','/clients-logo-04.png','/clients-logo-05.png','/clients-logo-06.png','/clients-logo-07.png','/clients-logo-08.png'
]

export default function AboutPage() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(
      '.about-value-card, .about-team-card, .about-mv-card, .about-timeline-card, .about-mission-img-wrapper, .about-mission-img-wrapper img, .about-process-card, .clients-logos img, .client-logo-card, .about-section-label, .about-section-title, .about-section-text, .about-section-subtitle, .about-stat-item, .about-cta-inner, .about-cta-content'
    ))
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            obs.unobserve(e.target)
          }
        })
      }, { threshold: 0.12 })
      els.forEach(el => io.observe(el))
      return () => io.disconnect()
    } else {
      els.forEach(el => el.classList.add('in-view'))
    }
  }, [])

  useEffect(() => {
    const statsBar = document.querySelector('.about-stats-bar')
    if (!statsBar) return

    const animateNumbers = () => {
      const nums = Array.from(statsBar.querySelectorAll('.about-stat-number'))
      nums.forEach(el => {
        const raw = el.dataset.target || el.textContent || ''
        const digits = parseInt(raw.toString().replace(/[^0-9]/g, ''), 10) || 0
        const suffix = raw.toString().replace(/[0-9]/g, '')
        let current = 0
        const duration = 1200
        const step = Math.max(1, Math.floor(digits / (duration / 16)))
        const timer = setInterval(() => {
          current += step
          if (current >= digits) {
            el.textContent = `${digits}${suffix}`
            clearInterval(timer)
          } else {
            el.textContent = `${current}${suffix}`
          }
        }, 16)
      })
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animateNumbers()
            obs.disconnect()
          }
        })
      }, { threshold: 0.2 })
      io.observe(statsBar)
      return () => io.disconnect()
    } else {
      animateNumbers()
    }
  }, [])

  return (
    <main className="about-page">

      {/* Banner (shared) */}
      <PageBanner title="About Us" breadcrumbs={[{ label: 'About Us' }]} />

      {/* (Kept PageBanner above; no extra hero — preserving existing header/banner/footer) */}

      {/* STATS BAR */}
      <section className="about-stats-bar">
        <div className="container">
          <div className="about-stats-grid">
            {stats.map((s, i) => (
              <div className="about-stat-item" key={i} data-aos="zoom-in" data-aos-delay={i * 100}>
                <span className="about-stat-number">{s.number}</span>
                <span className="about-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="about-mission-section section py-6">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="about-mission-img-wrapper" data-aos="zoom-in" data-aos-delay="80">
                <img src="/socialmedia.webp" alt="Our Mission" className="about-mission-img" />
                <div className="about-mission-badge-float">
                  <i className="bi bi-trophy-fill"></i>
                  <span>Award Winning Agency</span>
                </div>
                <div className="about-mission-card-glow"></div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="100">
              <div className="about-section-label">Who We Are</div>
              <h2 className="about-section-title">
                Crafting Digital Experiences<br />
                <span className="about-title-gradient">That Drive Real Growth</span>
              </h2>
              <p className="about-section-text">
                Plutuss Digital is a full-service digital marketing agency. Since 2016,
                we have been helping businesses of all sizes build powerful online presences,
                reach their target audiences, and achieve sustainable growth.
              </p>
              <p className="about-section-text">
                From SEO and social media to brand design and web development — we offer a
                complete digital ecosystem tailored to your unique business needs.
              </p>
              <div className="about-mv-cards">
                <div className="about-mv-card" data-aos="fade-up" data-aos-delay="120">
                  <div className="about-mv-icon"><i className="bi bi-bullseye"></i></div>
                  <div>
                    <h4>Our Mission</h4>
                    <p>To empower every brand with the digital tools and strategies needed to stand out and grow.</p>
                  </div>
                </div>
                <div className="about-mv-card" data-aos="fade-up" data-aos-delay="180">
                  <div className="about-mv-icon"><i className="bi bi-eye-fill"></i></div>
                  <div>
                    <h4>Our Vision</h4>
                    <p>To be the most trusted digital growth partner for 1000+ businesses across India by 2028.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values-section section py-6">
        <div className="about-values-bg"></div>
        <div className="container position-relative">
          <div className="text-center mb-5">
            <div className="about-section-label" data-aos="fade-up">What We Stand For</div>
            <h2 className="about-section-title" data-aos="fade-up" data-aos-delay="100">
              Our Core <span className="about-title-gradient">Values</span>
            </h2>
            <p className="about-section-subtitle" data-aos="fade-up" data-aos-delay="200">
              These principles guide every decision we make and every campaign we build.
            </p>
          </div>
          <div className="row g-4">
            {values.map((v, i) => (
              <div className="col-lg-4 col-md-6" key={i} data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="about-value-card">
                  <div className="about-value-icon" style={{ '--icon-color': v.color }}>
                    <i className={`bi ${v.icon}`}></i>
                  </div>
                  <h3 className="about-value-title">{v.title}</h3>
                  <p className="about-value-desc">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY / TIMELINE */}
      <section className="about-timeline-section section py-6">
        <div className="container">
          <div className="text-center mb-5">
            <div className="about-section-label" data-aos="fade-up">Our Journey</div>
            <h2 className="about-section-title" data-aos="fade-up" data-aos-delay="100">
              Building Success <span className="about-title-gradient">Since 2016</span>
            </h2>
          </div>
          <div className="about-timeline-track">
            {milestones.map((m, i) => (
              <div
                className="about-timeline-item"
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 120}
              >
                <div className="about-timeline-dot">
                  <span>{m.year}</span>
                </div>
                <div className="about-timeline-card">
                  <h4 className="about-timeline-title">{m.title}</h4>
                  <p className="about-timeline-desc">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORK PROCESS */}
      {/* <section className="about-process-section section py-6">
        <div className="container">
          <div className="text-center mb-5">
            <div className="about-section-label">Work Process</div>
            <h2 className="about-section-title">We follow Few Steps</h2>
            <p className="about-section-subtitle">Globally reinvent cross-unit human capital whereas virtual catalysts for change.</p>
          </div>
          <div className="about-process-layout">
            <div className="about-process-line"></div>
            {workSteps.map((s, i) => (
              <div
                className={`about-process-item ${i % 2 === 0 ? 'left' : 'right'}`}
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <div className="about-process-card">
                  <div className="process-step-badge">
                    <span className="process-step-label">Step</span>
                    <span className="process-step-number">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="process-step-content">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <ClientLogoSection />

      {/* TEAM */}
      <section className="about-team-section section py-6">
        <div className="about-team-bg"></div>
        <div className="container position-relative">
          <div className="text-center mb-5">
            <div className="about-section-label" data-aos="fade-up">The People Behind the Magic</div>
            <h2 className="about-section-title" data-aos="fade-up" data-aos-delay="100">
              Meet Our <span className="about-title-gradient">Expert Team</span>
            </h2>
            <p className="about-section-subtitle" data-aos="fade-up" data-aos-delay="200">
              A diverse group of passionate professionals united by one goal — your brand's success.
            </p>
          </div>
          <div className="row g-4">
            {teamMembers.map((member, i) => (
              <div className="col-lg-3 col-md-6" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="about-team-card">
                  <div className="about-team-avatar-wrapper">
                    <div className="about-team-avatar" style={{ '--avatar-color': member.color }}>
                      <span>{member.avatar}</span>
                    </div>
                    <div className="about-team-avatar-ring"></div>
                  </div>
                  <h3 className="about-team-name">{member.name}</h3>
                  <span className="about-team-role">{member.role}</span>
                  <p className="about-team-bio">{member.bio}</p>
                  <a href={member.linkedin} className="about-team-linkedin" aria-label="LinkedIn">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section section py-6">
        <div className="container">
          <div className="about-cta-inner" data-aos="zoom-in">
            <div className="about-cta-glow"></div>
            <div className="about-cta-content text-center">
              <div className="about-section-label">Ready to Grow?</div>
              <h2 className="about-cta-title">
                Let's Build Something <span className="about-title-gradient">Amazing Together</span>
              </h2>
              <p className="about-cta-text">
                Join 200+ brands that trust Plutuss Digital to power their digital growth.
                Your success story starts with a conversation.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap mt-4">
                <NavLink to="/contact" className="about-btn-primary" data-aos="fade-up" data-aos-delay="120">
                  Get Free Consultation <i className="bi bi-arrow-right ms-2"></i>
                </NavLink>
                <a href="mailto:info.plutuss@gmail.com" className="about-btn-ghost" data-aos="fade-up" data-aos-delay="180">
                  <i className="bi bi-envelope me-2"></i> Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
