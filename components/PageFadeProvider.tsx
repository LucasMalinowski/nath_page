'use client'

import { useEffect } from 'react'

const PageFadeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.body.classList.remove('page-fade-out')
  }, [])

  return <>{children}</>
}

export default PageFadeProvider
