'use client'

import { useEffect, useMemo, useState } from 'react'

type TypewriterProps = {
  text: string
  speedMs?: number
}

const Typewriter = ({ text, speedMs = 35 }: TypewriterProps) => {
  const [index, setIndex] = useState(text.length)

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setIndex(text.length)
      return
    }

    setIndex(0)
    const timer = window.setInterval(() => {
      setIndex((current) => {
        if (current >= text.length) {
          window.clearInterval(timer)
          return text.length
        }
        return current + 1
      })
    }, speedMs)

    return () => window.clearInterval(timer)
  }, [reducedMotion, speedMs, text])

  return (
    <span aria-label={text}>
      {text.slice(0, index)}
      {!reducedMotion && index < text.length ? (
        <span className="typewriter-cursor" aria-hidden="true">
          ▍
        </span>
      ) : null}
    </span>
  )
}

export default Typewriter
