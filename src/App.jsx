import './digimark-theme.css'
import './digimark-pages.css'
import './App.css'
import './page-banner.css'
import './site-theme.css'
import './plutus-palette.css'
import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import TopNav from './components/TopNav'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PlatformPage from './pages/PlatformPage'
import SolutionsPage from './pages/SolutionsPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import SEOPage from './pages/SEOPage'
import SocialMediaPage from './pages/SocialMediaPage'
import BrandingPage from './pages/BrandingPage'
import ContentCreationPage from './pages/ContentCreationPage'
import WebDevelopmentPage from './pages/WebDevelopmentPage'
import PerformanceMarketingPage from './pages/PerformanceMarketingPage'
import AboutPage from './pages/AboutPage'
import PoliticalPage from './pages/PoliticalPage'
import BlogsPage from './pages/BlogsPage'
import BlogDetailPage from './pages/BlogDetailPage'

const seoConfig = {
  '/': {
    title: 'Plutus Digital Asset | Digital Marketing Agency',
    description:
      'Plutus Digital Asset delivers SEO, social media marketing, branding, web development, and performance marketing services for growing businesses.',
    keywords:
      'digital marketing agency, SEO services, social media marketing, branding agency, performance marketing, web development, digital marketing company',
  },
  '/about': {
    title: 'About Plutus Digital Asset | Digital Marketing Experts',
    description:
      'Learn about Plutus Digital Asset, a digital marketing agency helping brands grow with strategy, creativity, and measurable results.',
    keywords:
      'about digital marketing agency, online marketing company, brand growth partner, digital strategy experts',
  },
  '/political': {
    title: 'Political Digital Strategy | Plutus Digital Asset',
    description:
      'Plutus Digital Asset offers political campaign strategy, digital outreach, voter engagement, and communication solutions for leaders.',
    keywords:
      'political digital strategy, political campaign management, voter outreach, digital political consulting, election campaign marketing',
  },
  '/blogs': {
    title: 'Digital Marketing Blog | Plutus Digital Asset',
    description:
      'Explore insights on SEO, social media strategy, content marketing, branding, and digital growth from Plutus Digital Asset.',
    keywords:
      'digital marketing blog, SEO tips, social media strategy, content marketing blog, branding insights',
  },
  '/platform': {
    title: 'Marketing Platform Solutions | Plutus Digital Asset',
    description:
      'Discover platform-based digital marketing solutions that help brands scale engagement, visibility, and conversion online.',
    keywords:
      'marketing platform, digital growth platform, online brand solutions, digital engagement platform',
  },
  '/solutions': {
    title: 'Digital Marketing Solutions | Plutus Digital Asset',
    description:
      'Find custom digital marketing solutions for SEO, social media, branding, content, web development, and paid growth.',
    keywords:
      'digital marketing solutions, SEO solutions, social media solutions, branding solutions, web solutions',
  },
  '/contact': {
    title: 'Contact Plutus Digital Asset | Grow Your Brand',
    description:
      'Get in touch with Plutus Digital Asset for SEO, social media, branding, and web development services tailored to your business.',
    keywords:
      'contact digital marketing agency, SEO expert contact, social media agency contact, web development inquiry',
  },
  '/services/seo': {
    title: 'SEO Services | Plutus Digital Asset',
    description:
      'Improve search visibility and organic traffic with Plutus Digital Asset’s technical SEO, on-page SEO, and content-driven strategies.',
    keywords:
      'SEO services, search engine optimization, local SEO, technical SEO, organic growth agency',
  },
  '/services/social-media': {
    title: 'Social Media Marketing Services | Plutus Digital Asset',
    description:
      'Build stronger online presence with social media marketing, content planning, campaign management, and audience growth.',
    keywords:
      'social media marketing, social media management, Instagram marketing, Facebook ads, content strategy',
  },
  '/services/branding': {
    title: 'Branding Services | Plutus Digital Asset',
    description:
      'Create a strong brand identity with logo design, positioning, messaging, and visual storytelling from Plutus Digital Asset.',
    keywords:
      'branding services, brand identity design, logo design, brand strategy, visual branding',
  },
  '/services/content': {
    title: 'Content Creation Services | Plutus Digital Asset',
    description:
      'Get high-quality content creation for blogs, websites, campaigns, and social media that supports digital growth.',
    keywords:
      'content creation services, copywriting services, website content, social media content, content marketing',
  },
  '/services/web': {
    title: 'Web Development Services | Plutus Digital Asset',
    description:
      'Launch modern websites and digital experiences with custom web development, UI design, and performance-focused builds.',
    keywords:
      'web development services, website design, custom website development, responsive web design, UI UX design',
  },
  '/services/performance': {
    title: 'Performance Marketing Services | Plutus Digital Asset',
    description:
      'Drive measurable growth with performance marketing, paid ads, lead generation, and conversion-focused campaigns.',
    keywords:
      'performance marketing, paid ads, lead generation, conversion marketing, digital advertising',
  },
}

function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    })
  }, [])

  useEffect(() => {
    AOS.refreshHard()
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [location.pathname])

  useEffect(() => {
    const page = seoConfig[location.pathname] || seoConfig['/']

    document.title = page.title

    const descriptionTag = document.querySelector('meta[name="description"]')
    if (descriptionTag) {
      descriptionTag.setAttribute('content', page.description)
    }

    let keywordsTag = document.querySelector('meta[name="keywords"]')
    if (!keywordsTag) {
      keywordsTag = document.createElement('meta')
      keywordsTag.setAttribute('name', 'keywords')
      document.head.appendChild(keywordsTag)
    }
    keywordsTag.setAttribute('content', page.keywords)

    const ogTitleTag = document.querySelector('meta[property="og:title"]')
    if (ogTitleTag) {
      ogTitleTag.setAttribute('content', page.title)
    }

    const ogDescriptionTag = document.querySelector('meta[property="og:description"]')
    if (ogDescriptionTag) {
      ogDescriptionTag.setAttribute('content', page.description)
    }
  }, [location.pathname])

  const handleInquiryChange = (event) => {
    const { name, value } = event.target
    setInquiryForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleInquirySubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    setInquiryForm({ name: '', email: '', phone: '', message: '' })
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = '+917385594572'
    const message = 'Hello Plutus Digital Asset, I would like to inquire about your services.'
    const waLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(waLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="site-shell">
      {!isLoginPage && <TopNav />}

      <div key={location.pathname} className="page-enter">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/political" element={<PoliticalPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:blogId" element={<BlogDetailPage />} />
        <Route path="/platform" element={<PlatformPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/services/seo" element={<SEOPage />} />
        <Route path="/services/social-media" element={<SocialMediaPage />} />
        <Route path="/services/branding" element={<BrandingPage />} />
        <Route path="/services/content" element={<ContentCreationPage />} />
        <Route path="/services/web" element={<WebDevelopmentPage />} />
        <Route path="/services/performance" element={<PerformanceMarketingPage />} />
      </Routes>
      </div>

      {!isLoginPage && <Footer />}

      {!isLoginPage && (
        <>
          <button type="button" className="floating-whatsapp-button" onClick={handleWhatsAppClick} aria-label="Open WhatsApp">
            <i className="bi bi-whatsapp"></i>
          </button>

          <button
            type="button"
            className={`floating-inquiry-toggle ${isInquiryOpen ? 'is-open' : ''}`}
            onClick={() => {
              setIsInquiryOpen((prev) => !prev)
              setSubmitted(false)
            }}
            aria-label="Open inquiry form"
          >
            <i className={`bi ${isInquiryOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`}></i>
          </button>

          <div className={`floating-inquiry-panel ${isInquiryOpen ? 'is-open' : ''}`}>
            <div className="floating-inquiry-header">
              <div>
                <p className="floating-inquiry-label">Quick Inquiry</p>
                <h3>Let's discuss your project</h3>
              </div>
              <button type="button" className="floating-inquiry-close" onClick={() => setIsInquiryOpen(false)} aria-label="Close inquiry form">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {submitted ? (
              <div className="floating-inquiry-success">
                <p className="success-title">Thank you!</p>
                <p>We’ve received your inquiry and will reach out shortly.</p>
                <button type="button" className="floating-inquiry-submit" onClick={() => setIsInquiryOpen(false)}>
                  Close
                </button>
              </div>
            ) : (
              <form className="floating-inquiry-form" onSubmit={handleInquirySubmit}>
                <label>
                  <span>Name</span>
                  <input type="text" name="name" value={inquiryForm.name} onChange={handleInquiryChange} placeholder="Your name" required />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" name="email" value={inquiryForm.email} onChange={handleInquiryChange} placeholder="you@example.com" required />
                </label>
                <label>
                  <span>Phone</span>
                  <input type="tel" name="phone" value={inquiryForm.phone} onChange={handleInquiryChange} placeholder="+91 73855 94572" />
                </label>
                <label>
                  <span>How can we help?</span>
                  <textarea name="message" rows="4" value={inquiryForm.message} onChange={handleInquiryChange} placeholder="Tell us about your requirement" required></textarea>
                </label>

                <button type="submit" className="floating-inquiry-submit">
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App
