import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

function getPortfolioFilePath(url: string) {
  const urlParts = url.split('/portfolio/')
  return urlParts.length > 1 ? urlParts[1] : null
}

function parsePortfolioImages(item: { images?: string | string[] | null; image_url?: string | null; cover_url?: string | null }) {
  if (item.images) {
    if (Array.isArray(item.images)) {
      return item.images.filter(Boolean)
    }

    if (typeof item.images === 'string') {
      try {
        const parsed = JSON.parse(item.images)
        if (Array.isArray(parsed)) {
          return parsed.filter((url): url is string => typeof url === 'string' && Boolean(url))
        }
      } catch (error) {
        console.warn('Failed to parse portfolio images JSON', error)
      }
    }
  }

  const fallback = item.cover_url || item.image_url
  return fallback ? [fallback] : []
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { supabaseAdmin } = await requireAdmin(request)
    const { id } = params

    const { data: image, error: fetchError } = await supabaseAdmin
      .from('portfolio_images')
      .select('id, image_url, cover_url, images')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    if (!image) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const imageList = parsePortfolioImages(image)
    const coverImage = image.cover_url || image.image_url || null
    const filesToRemove = [...imageList]

    if (coverImage && !filesToRemove.includes(coverImage)) {
      filesToRemove.push(coverImage)
    }

    const paths = filesToRemove.map(getPortfolioFilePath).filter((path): path is string => Boolean(path))
    if (paths.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage.from('portfolio').remove(paths)
      if (storageError) {
        console.warn('Portfolio storage delete error:', storageError)
      }
    }

    const { error: deleteError } = await supabaseAdmin.from('portfolio_images').delete().eq('id', id)
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not delete project'
    const status = message === 'Authentication required' ? 401 : message === 'Admin access required' ? 403 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
