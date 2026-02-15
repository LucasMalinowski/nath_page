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

export type GalleryProduct = {
    id: string
    name: string
    description: string | null
    author: string | null
    price_text: string | null
    quantity: number | null
    images: string[] | string | null
    display_order: number | null
    is_visible: boolean | null
    created_at: string
    updated_at: string | null
}

export type GalleryExhibitor = {
    id: string
    name: string
    title: string | null
    instagram_path: string | null
    avatar_url: string | null
    display_order: number | null
    is_visible: boolean | null
    created_at: string
    updated_at: string | null
}
