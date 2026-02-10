import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type PortfolioImage = {
    id: string
    title: string
    description: string | null
    image_url: string
    images?: string | string[] | null
    display_order: number
    is_visible: boolean
    created_at: string
    updated_at: string
}

export type SiteText = {
    id: string
    key: string
    value: string
    created_at: string
    updated_at: string
}
