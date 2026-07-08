import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageBanner from '../components/PageBanner'

export default function ContactPage() {
  const location = useLocation()
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', message: '', interest: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  useEffect(() => {
    if (location.hash === '#contact-form') {
      setTimeout(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    }
  }, [location.hash, location.pathname])

  return (
    <main className="main contact-page">
      <PageBanner title="Contact Us" breadcrumbs={[{ label: 'Contact' }]} />

      <section className="contact-hero-section">
        <div className="container">
          <div className="contact-hero-card" data-aos="fade-up">
            <div className="contact-hero-copy">
              <span className="contact-section-tag">Let's Talk</span>
              <h2>We'd love to hear about your next big idea.</h2>
              <p>
                Whether you're launching a brand, scaling your marketing, or building a website,
                our team is ready to help with sharp strategy and clean execution.
              </p>
            </div>
            <div className="contact-hero-details">
              <div className="contact-hero-pill">
                <i className="bi bi-telephone-fill"></i>
                <a href="tel:+917385594572">+91 73855 94572</a>
              </div>
              <div className="contact-hero-pill">
                <i className="bi bi-envelope-fill"></i>
                <a href="mailto:info.plutuss@gmail.com">info.plutuss@gmail.com</a>
              </div>
              <div className="contact-hero-pill">
                <i className="bi bi-geo-alt-fill"></i>
                <a href="https://maps.app.goo.gl/PgFtHWD1CmeK6eT4A" target="_blank" rel="noopener noreferrer">
                  212- City Avenue Commercial, Wakad, Pune-57
                </a>
              </div>
              <div className="contact-hero-pill">
                <i className="bi bi-clock-fill"></i>
                <span>Mon - Fri • 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row gy-4 align-items-stretch">
          <div className="col-lg-5">
            <article className="content-card h-100 p-4 p-lg-5 contact-info-card" data-aos="fade-right">
              <h3 className="contact-card-title">Contact Information</h3>
              <p className="contact-card-subtext">
                Reach out for strategy, branding, SEO, content, web development, or paid media support.
              </p>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <p className="mb-1 fw-semibold text-dark">Email Us</p>
                  <a href="mailto:info.plutuss@gmail.com" className="text-decoration-none contact-info-link">
                    info.plutuss@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div>
                  <p className="mb-1 fw-semibold text-dark">Call Us</p>
                  <a href="tel:+917385594572" className="text-decoration-none contact-info-link">
                    +91 73855 94572
                  </a>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <p className="mb-1 fw-semibold text-dark">Visit Us</p>
                  <a href="https://maps.app.goo.gl/PgFtHWD1CmeK6eT4A" target="_blank" rel="noopener noreferrer" className="text-decoration-none contact-info-link">
                    212- City Avenue Commercial, Wakad, Pune-57
                  </a>
                </div>
              </div>

              <div className="mt-4">
                <p className="fw-semibold text-dark mb-3">Follow Us</p>
                <div className="d-flex flex-wrap gap-3">
                  <a href="https://www.facebook.com/plutuss.digital" target="_blank" rel="noopener noreferrer" className="contact-social-icon" aria-label="Facebook">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="https://x.com/PlutussD" target="_blank" rel="noopener noreferrer" className="contact-social-icon" aria-label="Twitter">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a href="https://www.instagram.com/plutussdigital/" target="_blank" rel="noopener noreferrer" className="contact-social-icon" aria-label="Instagram">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="https://www.linkedin.com/company/plutussdigital" target="_blank" rel="noopener noreferrer" className="contact-social-icon" aria-label="LinkedIn">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
            </article>
          </div>

          <div className="col-lg-7">
            <article id="contact-form" className="content-card h-100 p-4 p-lg-5 contact-form-card" data-aos="fade-left">
              {submitted ? (
                <div className="text-center py-5">
                  <div className="contact-success-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <h3 className="text-dark mb-3">Thank You!</h3>
                  <p className="text-muted">
                    We've received your request and will be in touch within 1 business day.
                  </p>
                  <button className="btn-request-demo mt-3" onClick={() => setSubmitted(false)}>
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="contact-card-title mb-2">Request a Consultation</h3>
                  <p className="contact-card-subtext mb-4">
                    Share your goals and we will get back to you with the right solution.
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="row gy-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">Full Name *</label>
                        <input type="text" name="name" className="form-control contact-input" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">Email Address *</label>
                        <input type="email" name="email" className="form-control contact-input" placeholder="john@company.com" value={formData.email} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">Company</label>
                        <input type="text" name="company" className="form-control contact-input" placeholder="Your Company" value={formData.company} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">Phone Number</label>
                        <input type="tel" name="phone" className="form-control contact-input" placeholder="+91 73855 94572" value={formData.phone} onChange={handleChange} />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold text-dark">I'm interested in</label>
                        <select name="interest" className="form-control contact-input" value={formData.interest} onChange={handleChange}>
                          <option value="">Select a solution...</option>
                          <option value="seo">SEO & Growth</option>
                          <option value="social">Social Media</option>
                          <option value="branding">Branding & Design</option>
                          <option value="content">Content Creation</option>
                          <option value="web">Web Development</option>
                          <option value="performance">Performance Marketing</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold text-dark">Message</label>
                        <textarea name="message" className="form-control contact-input" rows="4" placeholder="Tell us about your needs..." value={formData.message} onChange={handleChange}></textarea>
                      </div>
                      <div className="col-12 mt-2">
                        <button type="submit" className="btn-request-demo w-100">
                          Send Request <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </article>
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <article className="content-card p-4 p-lg-5 contact-map-card" data-aos="fade-up">
          <div className="contact-map-header">
            <div>
              <span className="contact-section-tag">Visit Us</span>
              <h3 className="contact-card-title mb-2">Our Office Location</h3>
              <p className="contact-card-subtext mb-0">
                We welcome collaborations, meetings, and strategy sessions at our office in Wakad.
              </p>
            </div>
            <div className="contact-map-meta">
              <p className="fw-semibold text-dark mb-1">Plutuss Digital Asset</p>
              <p className="text-muted mb-0">Wakad, Pune, Maharashtra, India</p>
            </div>
          </div>
          <div className="map-container">
            <iframe
              src="https://maps.google.com/maps?q=Plutuss%20Digital%20Wakad%20Pune&t=&z=15&ie=UTF8&iwloc=&output=embed"
              title="Plutuss Digital Office Map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </article>
      </section>
    </main>
  )
}
