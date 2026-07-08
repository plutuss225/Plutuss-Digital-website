import { NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

export default function PageBanner({ title, breadcrumbs = [], backgroundImage, mobileBackgroundImage, bannerClass }) {
  const [isInView, setIsInView] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576)
  const bannerRef = useRef(null)

  useEffect(() => {
    const banner = bannerRef.current
    if (!banner) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    )

    observer.observe(banner)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Use mobile image on mobile screens if available, otherwise use default
  const bannerSrc = (isMobile && mobileBackgroundImage) ? mobileBackgroundImage : (backgroundImage || '/Banner.png')
  const bannerAlt = backgroundImage ? 'Political hero banner' : 'Banner'

  return (
    <section
      ref={bannerRef}
      className={`page-banner sticky-banner ${isInView ? 'in-view' : ''} ${bannerClass || ''}`}
      aria-hidden={false}
    >
      <img src={bannerSrc} alt={bannerAlt} className="page-banner-img" />
      <div className="page-banner-overlay">
        <h1 className="page-banner-title">{title}</h1>
        <div className="page-banner-breadcrumbs">
          <NavLink to="/" className="breadcrumb-link">Home</NavLink>
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="breadcrumb-sep-wrap">
              <span className="breadcrumb-sep">›</span>
              {crumb.path ? (
                <NavLink to={crumb.path} className="breadcrumb-link">{crumb.label}</NavLink>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
