import { useEffect, useState } from 'react'

export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1200)
    const hideTimer = setTimeout(() => setVisible(false), 1700)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`dm-preloader${fadeOut ? ' fade-out' : ''}`}>
      <div className="dm-preloader-inner">
        <div className="dm-loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="dm-preloader-text">Loading...</p>
      </div>
    </div>
  )
}
