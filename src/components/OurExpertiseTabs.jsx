import { useEffect, useId, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

function getIconClass(icon) {
  // Accept either `bi-xxx` or `xxx`.
  if (!icon) return 'bi-grid-3x3-gap-fill'
  return icon.startsWith('bi-') ? icon : `bi-${icon}`
}

export default function OurExpertiseTabs({ items }) {
  const uid = useId()
  const tabs = useMemo(() => items ?? [], [items])
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (active > tabs.length - 1) setActive(0)
  }, [active, tabs.length])

  const onKeyDown = (e) => {
    if (tabs.length === 0) return
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const last = tabs.length - 1
    if (e.key === 'Home') return setActive(0)
    if (e.key === 'End') return setActive(last)
    if (e.key === 'ArrowLeft') return setActive((v) => (v - 1 + tabs.length) % tabs.length)
    if (e.key === 'ArrowRight') return setActive((v) => (v + 1) % tabs.length)
  }

  const activeItem = tabs[active]

  return (
    <section className="dm-expertise ptb-100">
      <div className="container" data-aos="fade-up">
        <div className="section-heading text-center mb-5">
          <strong className="color-secondary">Our Services</strong>
          <h2>Outstanding Experience</h2>
          <span className="animate-border m-auto mb-4"></span>
          <p className="lead">
            We use polished strategy, creative execution, and performance marketing to deliver premium outcomes across every service.
          </p>
        </div>

        <div className="dm-expertise-tabs" role="tablist" aria-label="Our expertise tabs" onKeyDown={onKeyDown}>
          {tabs.map((t, idx) => {
            const tabId = `dm-tab-${uid}-${idx}`
            const panelId = `dm-panel-${uid}-${idx}`
            const selected = idx === active
            return (
              <button
                key={t.title}
                id={tabId}
                role="tab"
                type="button"
                className={`dm-expertise-tab${selected ? ' active' : ''}`}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(idx)}
              >
                <i className={`bi ${getIconClass(t.icon)}`} aria-hidden="true" />
                <span>{t.title}</span>
              </button>
            )
          })}
        </div>

        {activeItem ? (
          <div className="dm-expertise-panel-wrap">
            <div
              id={`dm-panel-${uid}-${active}`}
              role="tabpanel"
              aria-labelledby={`dm-tab-${uid}-${active}`}
              className="dm-expertise-panel"
            >
              <div className="row align-items-center gy-4">
                <div className="col-lg-6">
                  <div className="dm-expertise-visual">
                    <img src="/hero-01.svg" alt="" aria-hidden="true" />
                  </div>
                </div>
                <div className="col-lg-6">
                  <h3 className="dm-expertise-title">{activeItem.title}</h3>
                  <p className="dm-expertise-desc">{activeItem.description}</p>
                  <NavLink to={activeItem.path} className="detail-link mt-4 d-inline-flex align-items-center">
                    Learn More <i className="bi bi-arrow-right ms-2" />
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

