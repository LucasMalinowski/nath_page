import { createClient } from '@supabase/supabase-js'
import type { GalleryExhibitor, GalleryProduct, PortfolioImage } from '@/lib/supabase'

const createPublicSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}

export const getVisiblePortfolioImages = async (): Promise<PortfolioImage[]> => {
  const supabase = createPublicSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('portfolio_images')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Failed to load visible portfolio images for SEO render', error)
    return []
  }

  return data || []
}

export const getBrandExhibitors = async (): Promise<GalleryExhibitor[]> => {
  const supabase = createPublicSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('gallery_exhibitors')
    .select('*')
    .eq('is_visible', true)
    .eq('brand_member', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Failed to load brand exhibitors for SEO render', error)
    return []
  }

  return data || []
}

export const getGalleryProducts = async (): Promise<GalleryProduct[]> => {
  const supabase = createPublicSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('gallery_products')
    .select('*')
    .eq('is_visible', true)
    .gte('quantity', 1)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Failed to load gallery products for SEO render', error)
    return []
  }

  return data || []
}
