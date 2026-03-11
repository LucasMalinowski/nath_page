'use client'

import {useEffect, useMemo, useState} from 'react'

type TypewriterProps = {
  text: string,
  speedMs?: number,
  classes?: string
}

const Typewriter = ({text, speedMs = 35, classes}: TypewriterProps) => {
  const [index, setIndex] = useState(0)
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setIndex(text.length)
      return
    }

    const intervalId = setInterval(() => {
      setIndex((current) => {
        if (current >= text.length) {
          clearInterval(intervalId)
          return current
        }
        return current + 1
      })
    }, speedMs)

    return () => {
      clearInterval(intervalId)
    }
  }, [text, speedMs, reducedMotion])

  const visibleText = text.slice(0, index)
  const lines = visibleText.split('\n')

  return (
    <span
      aria-label={text}
      className={classes}
    >
      {lines.map((line, lineIndex) => (
        <span
          key={`${lineIndex}-${line}`}
          className={classes}
        >
          {line}
          {lineIndex < lines.length - 1 && <br/>}
        </span>
      ))}
      <span className="typewriter-cursor" aria-hidden="true">▍</span>
      <noscript>{text}</noscript>
      <style jsx>{`
          .typewriter-cursor {
              animation: blink 1s steps(2, start) infinite;
          }

          @keyframes blink {
              to {
                  opacity: 0;
              }
          }
      `}</style>
    </span>
  )
}

export default Typewriter
