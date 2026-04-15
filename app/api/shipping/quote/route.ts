import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getCheckoutProfile, quoteShippingForItems } from '@/lib/order-shipping'
import { isSuperFreteConfigured } from '@/lib/superfrete'

export const runtime = 'nodejs'

type ShippingQuoteBody = {
  productId?: string
  quantity?: number
}

type CartRow = {
  quantity: number
  product: {
    id: string
    name: string | null
    price_text: string | null
    quantity: number | null
    package_weight_grams: number | null
    package_height_cm: number | null
    package_width_cm: number | null
    package_length_cm: number | null
    is_visible: boolean | null
  } | null
}

async function resolveUser(request: Request) {
  const supabase = createServerSupabaseClient()
  const supabaseAdmin = getSupabaseAdmin()
  const cookieUserResponse = await supabase.auth.getUser()
  let user = cookieUserResponse.data.user

  if (!user) {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

    if (token) {
      const bearerUserResponse = await supabaseAdmin.auth.getUser(token)
      user = bearerUserResponse.data.user
    }
  }

  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}

export async function POST(request: Request) {
  try {
    if (!isSuperFreteConfigured()) {
      return NextResponse.json({ error: 'SuperFrete is not configured on the server' }, { status: 500 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const user = await resolveUser(request)
    const body = (await request.json().catch(() => ({}))) as ShippingQuoteBody
    const directProductId = body.productId?.trim()
    const directQuantity = Number.isInteger(body.quantity) && (body.quantity || 0) > 0 ? Number(body.quantity) : 1

    const items: Array<{ quantity: number; product: NonNullable<CartRow['product']> }> = []

    if (directProductId) {
      const { data: product, error } = await supabaseAdmin
        .from('gallery_products')
        .select(
          'id, name, price_text, quantity, package_weight_grams, package_height_cm, package_width_cm, package_length_cm, is_visible'
        )
        .eq('id', directProductId)
        .eq('is_visible', true)
        .maybeSingle()

      if (error || !product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      items.push({ quantity: directQuantity, product })
    } else {
      const { data: cartRows, error } = await supabaseAdmin
        .from('cart_items')
        .select(
          'quantity, product:gallery_products(id, name, price_text, quantity, package_weight_grams, package_height_cm, package_width_cm, package_length_cm, is_visible)'
        )
        .eq('user_id', user.id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      for (const row of (cartRows || []) as unknown as CartRow[]) {
        if (row.product && row.product.is_visible !== false) {
          items.push({ quantity: row.quantity, product: row.product })
        }
      }
    }

    if (items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const profile = await getCheckoutProfile(user.id)
    const result = await quoteShippingForItems({ profile, items })

    return NextResponse.json({
      options: result.options,
      package: result.volume
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not calculate shipping'
    const status = message === 'Authentication required' ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
