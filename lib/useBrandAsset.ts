'use client'

import { useEffect, useState } from 'react'
import { supabase, BrandAsset } from '@/lib/supabase'

export const useBrandAsset = (location: string) => {
    const [asset, setAsset] = useState<BrandAsset | null>(null)

    useEffect(() => {
        let isMounted = true

        const loadAsset = async () => {
            const { data, error } = await supabase
                .from('brand_assets')
                .select('*')
                .eq('location', location)
                .eq('is_active', true)
                .maybeSingle()

            if (!error && isMounted) {
                setAsset(data || null)
            }
        }

        loadAsset()

        return () => {
            isMounted = false
        }
    }, [location])

    return asset
}
