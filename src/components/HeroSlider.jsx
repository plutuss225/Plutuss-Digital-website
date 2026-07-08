import { useEffect, useState } from 'react'

export default function HeroSlider() {
  const heroSlides = [
    {
      src: '/hero-slide-1.png',
      badge: 'Trusted SEO & Marketing Experts',
      title: ['Boost Your SEO', 'and Brand Growth'],
      description: 'Drive more traffic, improve search rankings, and increase conversions with our professional SEO and marketing solutions.',
      circle: {
        label: 'Fast Launch',
        title: 'Creative campaigns live in 48 hours',
        details: 'Design, copy, and launch-ready strategy in one smooth delivery.',
      },
    },
    {
      src: '/hero-slide-2.png',
      badge: 'Performance-Driven Creative Strategy',
      title: ['Grow Your Brand', 'With Smart Campaigns'],
      description: 'Create impactful campaigns that sharpen presence and turn attention into measurable business growth.',
      circle: {
        label: 'Campaign Pulse',
        title: 'Data-led ads that actually convert',
        details: 'We track performance and optimize every campaign for better ROI.',
      },
    },
    {
      src: '/hero-slide-3.png',
      badge: 'Digital Growth Made Simple',
      title: ['Scale Visibility', 'Across Every Channel'],
      description: 'From SEO to social media and content strategy, we build a digital presence that keeps delivering.',
      circle: {
        label: 'Brand Momentum',
        title: 'Consistent growth with smart storytelling',
        details: 'Engage users, build trust, and keep your audience moving forward.',
      },
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length)
    }, 2800)

    return () => window.clearInterval(interval)
  }, [heroSlides.length])

  const heroSlide = heroSlides[activeIndex]

  return (
    <div className="dg-hero hero-bg-slider">
      <div className="hero-bg-slide">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.src}
            className={`hero-bg-slide-item ${index === activeIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.src})` }}
          />
        ))}
      </div>

      <div className="dg-overlay"></div>

      <div className="container position-relative">
        <div className="hero-copy text-white">
          <span className="hero-badge">{heroSlide.badge}</span>

          <div className="hero-text-slides">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.badge}
                className={`hero-slide-text ${index === activeIndex ? 'active' : ''}`}
              >
                <h1 className="fw-bold">
                  {slide.title.map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h1>
              </div>
            ))}
          </div>

          <div className="hero-description-slides">
            {heroSlides.map((slide, index) => (
              <p
                key={`${slide.badge}-desc`}
                className={`hero-description-slide ${index === activeIndex ? 'active' : ''}`}
              >
                {slide.description}
              </p>
            ))}
          </div>

          <div className="hero-btns">
            <a href="/contact" className="btn-hero-primary">
              Get Started Now <i className="bi bi-arrow-right ms-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
