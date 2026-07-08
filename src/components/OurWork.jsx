import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Card = ({ title, content, videoSrc, path, cardHeight, videoHeight, gridColumn, gridRow, className }) => {
  const [, setIsHovered] = useState(false)

  return (
    <div
      className={`work-card${className ? ` ${className}` : ''}`}
      style={{
        height: cardHeight,
        minHeight: cardHeight,
        maxHeight: cardHeight,
        gridColumn,
        gridRow,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="work-card-media" style={{ height: videoHeight, minHeight: videoHeight, maxHeight: videoHeight }}>
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="work-card-video"
        />
      </div>

      <div className="work-card-content">
        <div>
          <h3 className="work-card-title">{title}</h3>
          <p className="work-card-text">{content}</p>
        </div>
        <Link to={path} className="work-card-link">
          Read More <i className="bi bi-arrow-right-short"></i>
        </Link>
      </div>
    </div>
  )
}

const workCards = [
  {
    title: 'Website Development',
    content: 'Responsive user-friendly web development',
    videoSrc: '/OurWorkSection/webDevelopment.mp4',
    path: '/services/web',
    cardHeight: '520px',
    videoHeight: '300px',
    gridColumn: 'span 2',
    gridRow: 'span 2',
    className: 'tight-top',
  },
  {
    title: 'Ui/Ux',
    content: 'User-centered design',
    videoSrc: '/OurWorkSection/uiUx.mp4',
    path: '/services/web',
    cardHeight: '420px',
    videoHeight: '300px',
    gridColumn: 'span 1',
    gridRow: 'span 1',
  },
  {
    title: '2D/3D Animation',
    content: 'Engaging 2D/3D animations.',
    videoSrc: '/OurWorkSection/animation.mp4',
    path: '/services/content',
    cardHeight: '420px',
    videoHeight: '300px',
    gridColumn: 'span 1',
    gridRow: 'span 1',
  },
  {
    title: 'Application Development',
    content: 'Seamless custom app development for all',
    videoSrc: '/OurWorkSection/applicationDevelopment.mp4',
    path: '/services/web',
    cardHeight: '520px',
    videoHeight: '300px',
    gridColumn: 'span 2',
    gridRow: 'span 2',
  },
  {
    title: 'Digital Marketing',
    content: 'Boost brand visibility through social strategies',
    videoSrc: '/OurWorkSection/digitalMarketing.mp4',
    path: '/services/social-media',
    cardHeight: '420px',
    videoHeight: '300px',
    gridColumn: 'span 1',
    gridRow: 'span 1',
    className: 'tight-top',
  },
  {
    title: 'Graphic Design',
    content: 'Elevative graphic design enhances identity',
    videoSrc: '/OurWorkSection/graphicDesign.mp4',
    path: '/services/branding',
    cardHeight: '420px',
    videoHeight: '300px',
    gridColumn: 'span 1',
    gridRow: 'span 1',
    className: 'tight-top',
  },
]

export default function OurWork() {
  return (
    <section className="our-work-section section py-5">
      <div className="container" data-aos="fade-up">
        <div className="section-header text-center mb-5">
          <span className="section-label">Our Work</span>
          <h2 className="section-title">A polished showcase of our video-led campaigns</h2>
          <p className="section-description">
            Live previews from our work show how we combine motion, design and digital strategy to deliver memorable brand experiences.
          </p>
        </div>

        <div className="our-work-layout">
          <div className="our-work-grid">
            {workCards.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                content={card.content}
                videoSrc={card.videoSrc}
                path={card.path}
                cardHeight={card.cardHeight}
                videoHeight={card.videoHeight}
                gridColumn={card.gridColumn}
                gridRow={card.gridRow}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
