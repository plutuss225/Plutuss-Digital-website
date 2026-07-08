import { useEffect, useRef, useState } from 'react'

function parseValue(raw) {
  const value = String(raw)
  const suffix = value.replace(/[\d.]/g, '')
  const num = parseFloat(value.replace(/[^\d.]/g, ''))
  return { num: Number.isFinite(num) ? num : 0, suffix }
}

export default function AnimatedCounter({ value, duration = 1800, className = '' }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true

        const { num, suffix } = parseValue(value)
        const start = performance.now()

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - (1 - progress) ** 3
          const current = num * eased
          const formatted = suffix.includes('.')
            ? current.toFixed(1)
            : Math.round(current).toString()
          setDisplay(`${formatted}${suffix}`)
          if (progress < 1) requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.35 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
