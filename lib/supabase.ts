import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type PortfolioImage = {
    id: string
    title: string
    description: string | null
    phrase?: string | null
    image_url: string
    cover_url?: string | null
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
    package_weight_grams: number | null
    package_height_cm: number | null
    package_width_cm: number | null
    package_length_cm: number | null
    images: string[] | string | null
    display_order: number | null
    is_visible: boolean | null
    created_at: string
    updated_at: string | null
}

export type UserProfile = {
    id: string
    admin: boolean | null
    full_name: string | null
    phone: string | null
    document: string | null
    address_line1: string | null
    address_line2: string | null
    address_number: string | null
    district: string | null
    city: string | null
    state: string | null
    postal_code: string | null
    country: string | null
    created_at: string | null
}

export type GalleryExhibitor = {
    id: string
    name: string
    title: string | null
    description: string | null
    brand_member: boolean | null
    exhibitor_member: boolean | null
    instagram_path: string | null
    avatar_url: string | null
    display_order: number | null
    is_visible: boolean | null
    created_at: string
    updated_at: string | null
}

export type Coupon = {
    id: string
    code: string
    discount_percent: number | null
    discount_type: 'percentage' | 'fixed' | null
    discount_value_cents: number | null
    is_active: boolean | null
    expires_at: string | null
    max_uses: number | null
    uses_count: number | null
    created_at: string | null
    updated_at: string | null
}
