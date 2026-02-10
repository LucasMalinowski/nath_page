import { PortfolioImage } from '@/lib/supabase'

export const parseImageList = (item: PortfolioImage): string[] => {
    if (item.images) {
        if (Array.isArray(item.images)) return item.images
        if (typeof item.images === 'string') {
            try {
                const parsed = JSON.parse(item.images)
                if (Array.isArray(parsed)) return parsed
            } catch (error) {
                console.warn('Failed to parse images JSON', error)
            }
        }
    }
    if (item.image_url) return [item.image_url]
    return []
}

export const parseGalleryImages = (item: { images?: string | string[] | null }): string[] => {
    if (!item.images) return []
    if (Array.isArray(item.images)) return item.images
    if (typeof item.images === 'string') {
        try {
            const parsed = JSON.parse(item.images)
            return Array.isArray(parsed) ? parsed : []
        } catch (error) {
            console.warn('Failed to parse gallery images JSON', error)
        }
    }
    return []
}
