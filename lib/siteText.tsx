'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, SiteText } from '@/lib/supabase'

type SiteTextMap = Record<string, string>

const SiteTextContext = createContext<SiteTextMap>({})

export const SiteTextProvider = ({ children }: { children: React.ReactNode }) => {
  const [texts, setTexts] = useState<SiteTextMap>({})

  useEffect(() => {
    let isMounted = true

    const loadTexts = async () => {
      const { data, error } = await supabase
        .from('site_texts')
        .select('*')

      if (!error && isMounted) {
        const map = (data || []).reduce<SiteTextMap>((acc, item: SiteText) => {
          acc[item.key] = item.value
          return acc
        }, {})
        setTexts(map)
      }
    }

    loadTexts()

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo(() => texts, [texts])

  return (
    <SiteTextContext.Provider value={value}>
      {children}
    </SiteTextContext.Provider>
  )
}

export const useSiteText = (key: string, fallback: string) => {
  const texts = useContext(SiteTextContext)
  return texts[key] ?? fallback
}

export const renderTextWithBreaks = (text: string) => {
  const parts = text.split('\n')
  return parts.map((part, index) => (
    <span key={`${index}-${part}`}>
      {part}
      {index < parts.length - 1 && <br />}
    </span>
  ))
}
