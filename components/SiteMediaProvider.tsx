'use client'

import { useEffect } from 'react'
import { useSiteMedia } from '@/lib/useSiteMedia'

const SiteMediaProvider = ({ children }: { children: React.ReactNode }) => {
  const backgroundTexture = useSiteMedia('background_texture')

  useEffect(() => {
    const url = backgroundTexture?.url
    if (url) {
      document.documentElement.style.setProperty('--paper-texture-url', `url('${url}')`)
    }
  }, [backgroundTexture?.url])

  return <>{children}</>
}

export default SiteMediaProvider
