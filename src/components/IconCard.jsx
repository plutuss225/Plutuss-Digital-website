export default function IconCard({
  icon,
  title,
  text,
  iconBgColor = 'rgba(123, 67, 250, 0.1)',
  iconColor = 'var(--brand)',
  iconSize = '80px',
  iconRadius = '50%',
  iconFontSize = '2rem',
  delay = 0,
  className = 'col-lg-4 col-md-6',
  cardClassName = 'content-card icon-card-shell h-100 p-4 transition-hover p-lg-5'
}) {
  return (
    <div className={className} data-aos="fade-up" data-aos-delay={delay}>
      <article className={cardClassName}>
        <div
          className="mb-4 d-inline-flex align-items-center justify-content-center"
          style={{ width: iconSize, height: iconSize, background: iconBgColor, borderRadius: iconRadius, color: iconColor, fontSize: iconFontSize }}
        >
          <i className={`bi bi-${icon}`}></i>
        </div>
        <h3 className="mb-3 fw-bold text-dark">{title}</h3>
        <p className="text-muted mb-0">{text}</p>
      </article>
    </div>
  )
}
