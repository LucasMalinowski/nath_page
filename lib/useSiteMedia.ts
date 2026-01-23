'use client'

import { useEffect, useState } from 'react'
import { supabase, SiteMedia } from '@/lib/supabase'

export const useSiteMedia = (key: string) => {
    const [media, setMedia] = useState<SiteMedia | null>(null)

    useEffect(() => {
        let isMounted = true

        const loadMedia = async () => {
            const { data, error } = await supabase
                .from('site_media')
                .select('*')
                .eq('key', key)
                .maybeSingle()

            if (!error && isMounted) {
                setMedia(data || null)
            }
        }

        loadMedia()

        return () => {
            isMounted = false
        }
    }, [key])

    return media
}
