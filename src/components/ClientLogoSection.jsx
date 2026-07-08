import React from 'react'
import './ClientLogoSection.css'

const logos = [
  '/plutus-logo.png',
  '/prosumers-logo.png',
  '/royal-court-logo.png',
  '/trimortal-logo.png',
  '/parliament-01.png',
  '/brand1.jpeg',
  '/brand2.png',
  '/brand3.jpeg',
  '/hero-slide-3.png',
  '/hero-slide-4.png'
]

export default function ClientLogoSection() {
  const marqueeLogos = [...logos, ...logos]

  return (
    <section className="client-logo-section" aria-label="Trusted by our clients">
      <div className="client-logo-section__decor client-logo-section__decor--triangle one" />
      <div className="client-logo-section__decor client-logo-section__decor--circle two" />
      <div className="client-logo-section__decor client-logo-section__decor--bar three" />
      <div className="client-logo-section__decor client-logo-section__decor--triangle four" />

      <div className="container client-logo-section__inner">
        <div className="client-logo-section__content">
          <div className="client-logo-section__box">
            <div className="client-logo-section__heading-wrap">
              <span className="client-logo-section__eyebrow">Trusted by leading brands</span>
              <h3 className="client-logo-section__title">Who are Happy With Services and Work</h3>
            </div>
          </div>

          <div className="client-logo-section__text">
            <p>
              We build long-term digital partnerships with ambitious brands by combining
              strategy, design, performance, and creativity into one seamless growth engine.
            </p>
          </div>
        </div>

        <div className="client-logo-section__card">
          <div className="client-logo-section__track">
            {marqueeLogos.map((logo, index) => (
              <div className="client-logo-section__logo-item" key={`${logo}-${index}`}>
                <img src={logo} alt={`Client logo ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
