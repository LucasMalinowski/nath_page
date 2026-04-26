'use client'

import {useEffect, useMemo, useState} from 'react'

type TypewriterProps = {
  text: string,
  speedMs?: number,
  loop?: boolean,
  classes?: string
}

const Typewriter = ({text, speedMs = 80, loop = true, classes}: TypewriterProps) => {
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setIndex(text.length)
      setIsDeleting(false)
      return
    }

    if (!loop && index >= text.length) {
      return
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (!isDeleting && index < text.length) {
      timeoutId = setTimeout(() => {
        setIndex((current) => current + 1)
      }, speedMs)
    } else if (loop && !isDeleting && index >= text.length) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true)
      }, 5000)
    } else if (loop && isDeleting && index > 0) {
      timeoutId = setTimeout(() => {
        setIndex((current) => current - 1)
      }, speedMs / 2)
    } else if (loop && isDeleting && index <= 0) {
      timeoutId = setTimeout(() => {
        setIsDeleting(false)
      }, speedMs)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [text, speedMs, loop, index, isDeleting, reducedMotion])

  const visibleText = text.slice(0, index)
  const lines = visibleText.split('\n')

  return (
    <span
      aria-label={text}
      className={classes}
      style={{display: 'inline-block', position: 'relative', verticalAlign: 'top'}}
    >
      <span aria-hidden="true" className="typewriter-placeholder">
        {text}
      </span>
      <span aria-hidden="true" className="typewriter-content">
        {lines.map((line, lineIndex) => (
          <span key={`${lineIndex}-${line}`}>
            {line}
            {lineIndex < lines.length - 1 && <br />}
          </span>
        ))}
        <span className="typewriter-cursor">|</span>
      </span>
      <style jsx>{`
          .typewriter-placeholder {
              visibility: hidden;
              white-space: pre-line;
              user-select: none;
          }

          .typewriter-content {
              position: absolute;
              top: 0;
              left: 0;
              white-space: pre-line;
              pointer-events: none;
          }

          .typewriter-cursor {
              animation: blink 1s steps(2, start) infinite;
              display: inline-block;
              font-weight: 300;
              transform: scaleX(0.7);
              transform-origin: left center;
              margin-left: 1px;
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
