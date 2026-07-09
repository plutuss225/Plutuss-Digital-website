import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [isHeroPast, setIsHeroPast] = useState(false)
  const router = useRouter()
  const isHomePage = router.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.dg-hero')
      const heroHeight = heroSection ? heroSection.offsetHeight : 780
      const shouldActivateLightHeader = !isHomePage || window.scrollY > Math.max(80, heroHeight - 140)
      setIsHeroPast(shouldActivateLightHeader)

      if (shouldActivateLightHeader) {
        setServicesOpen(false)
        setMobileServicesOpen(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isHomePage])

  useEffect(() => {
    setMenuOpen(false)
    setMobileServicesOpen(false)
  }, [router.pathname])

  const servicesLinks = [
    { to: '/services/seo', label: 'SEO', icon: 'bi-search-heart', desc: 'Boost search visibility and rankings' },
    { to: '/services/social-media', label: 'Social Media', icon: 'bi-broadcast', desc: 'Engage audiences with smart campaigns' },
    { to: '/services/content', label: 'Content Creation', icon: 'bi-pencil-square', desc: 'Create compelling stories and assets' },
    { to: '/services/branding', label: 'Branding & Design', icon: 'bi-palette2', desc: 'Build a standout visual identity' },
    { to: '/services/web', label: 'Web Development', icon: 'bi-laptop', desc: 'Launch fast, modern digital experiences' },
    { to: '/services/performance', label: 'Performance Marketing', icon: 'bi-graph-up-arrow', desc: 'Drive measurable growth and ROI' },
  ]

  const isActive = (path) => router.pathname === path

  return (
    <header className={`site-header${isHeroPast ? ' scrolled' : ''}`}>
      <div className="nav-container">
        {/* Brand */}
        <Link className="brand-mark" href="/">
          <img
            src={isHeroPast ? '/plutus-logo.png' : '/plutus-logo.png'}
            alt="Plutus Digital Asset Logo"
            className={`brand-logo${isHeroPast ? '' : ' brand-logo--light'}`}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="navmenu d-none d-lg-flex">
          <ul>
            <li>
              <Link href="/" className={isActive('/') ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className={isActive('/about') ? 'active' : ''}>
                About Us
              </Link>
            </li>
            <li
              className={`nav-item-has-dropdown${servicesOpen ? ' open' : ''}`}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="nav-dropdown-toggle" aria-expanded={servicesOpen}>
                Services Hub <i className="bi bi-caret-down-fill ms-2" />
              </button>
              <ul className="dropdown-menu services-dropdown">
                {servicesLinks.map((item) => (
                  <li key={item.to}>
                    <Link href={item.to} className="services-dropdown__link">
                      <span className="services-dropdown__icon">
                        <i className={`bi ${item.icon}`} />
                      </span>
                      <span className="services-dropdown__text">
                        <strong>{item.label}</strong>
                        <small>{item.desc}</small>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link href="/political" className={isActive('/political') ? 'active' : ''}>
                Political
              </Link>
            </li>
            <li>
              <Link href="/blogs" className={isActive('/blogs') ? 'active' : ''}>
                Blogs
              </Link>
            </li>
            <li>
              <Link href="/contact" className={isActive('/contact') ? 'active' : ''}>
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Side Actions */}
        <div className="nav-actions d-flex align-items-center gap-3">
          <Link href="/contact#contact-form" className="nav-cta-btn d-none d-lg-flex">
            Try It Free <i className="bi bi-arrow-right ms-2"></i>
          </Link>
          <button type="button" className="nav-icon-btn d-none d-lg-flex" aria-label="More actions">
            <i className="bi bi-grid-3x3-gap"></i>
          </button>

          {/* Mobile hamburger */}
          <button
            className={`mobile-toggle d-lg-none${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-nav${menuOpen ? ' is-open' : ''}`}>
          <div className="mobile-nav-inner">
          <button className="mobile-nav-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <i className="bi bi-x-lg"></i>
          </button>
          <ul>
            <li>
              <Link href="/" className={isActive('/') ? 'active' : ''}>
                Home
                <i className="bi bi-chevron-right ms-2" />
              </Link>
            </li>
            <li>
              <Link href="/about" className={isActive('/about') ? 'active' : ''}>
                About Us
                <i className="bi bi-chevron-right ms-2" />
              </Link>
            </li>
            <li className={`mobile-has-submenu ${mobileServicesOpen ? ' open' : ''}`}>
              <button className="mobile-submenu-toggle" onClick={() => setMobileServicesOpen(s => !s)} aria-expanded={mobileServicesOpen}>
                Services Hub <i className="bi bi-caret-down-fill ms-2" />
              </button>
              <ul className={`mobile-submenu ${mobileServicesOpen ? ' open' : ''}`}>
                <li><Link href="/services/seo">SEO</Link></li>
                <li><Link href="/services/social-media">Social Media Marketing</Link></li>
                <li><Link href="/services/content">Content Creation</Link></li>
                <li><Link href="/services/branding">Branding & Design</Link></li>
                <li><Link href="/services/web">Web Development</Link></li>
                <li><Link href="/services/performance">Performance Marketing</Link></li>
              </ul>
            </li>
            <li>
              <Link href="/political" className={isActive('/political') ? 'active' : ''}>
                Political
                <i className="bi bi-chevron-right ms-2" />
              </Link>
            </li>
            <li>
              <Link href="/blogs" className={isActive('/blogs') ? 'active' : ''}>
                Blogs
                <i className="bi bi-chevron-right ms-2" />
              </Link>
            </li>
            <li>
              <Link href="/contact" className={isActive('/contact') ? 'active' : ''}>
                Contact
                <i className="bi bi-chevron-right ms-2" />
              </Link>
            </li>
          </ul>
          <Link href="/contact#contact-form" className="mobile-cta-btn" onClick={() => setMenuOpen(false)}>
            Request Demo <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </header>
  )
}
