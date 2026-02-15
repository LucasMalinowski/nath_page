import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getMercadoPagoPreference } from '@/lib/mercadopago'
import { parseBrazilianPriceToCents } from '@/lib/price'

export const runtime = 'nodejs'

type CheckoutProductBody = {
  productId?: string
  quantity?: number
}

function getBaseUrl(request: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (envUrl) return envUrl.replace(/\/$/, '')

  const requestUrl = new URL(request.url)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || requestUrl.host
  if (!host) {
    throw new Error('Could not resolve request host')
  }
  const isLocalhost = host.includes('localhost') || host.startsWith('127.0.0.1')
  const proto = request.headers.get('x-forwarded-proto') || (isLocalhost ? 'http' : requestUrl.protocol.replace(':', '') || 'https')
  return `${proto}://${host}`
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const supabaseAdmin = getSupabaseAdmin()
    const mercadoPagoPreference = getMercadoPagoPreference()

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
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as CheckoutProductBody
    const productId = body.productId?.trim()
    const quantity = Number.isInteger(body.quantity) && (body.quantity || 0) > 0 ? (body.quantity as number) : 1

    if (!productId) {
      return NextResponse.json({ error: 'Product is required' }, { status: 400 })
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from('gallery_products')
      .select('id, name, price_text, is_visible, quantity')
      .eq('id', productId)
      .eq('is_visible', true)
      .maybeSingle()

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    if (!product.quantity || product.quantity < quantity) {
      return NextResponse.json({ error: 'Product is out of stock' }, { status: 400 })
    }

    const unitPriceCents = parseBrazilianPriceToCents(product.price_text)
    const totalCents = unitPriceCents * quantity

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        subtotal_cents: totalCents,
        discount_cents: 0,
        total_cents: totalCents,
        coupon_code: null
      })
      .select('id')
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: orderError?.message || 'Could not create order' }, { status: 500 })
    }

    const { error: itemError } = await supabaseAdmin.from('order_items').insert({
      order_id: order.id,
      product_id: product.id,
      product_name: product.name || 'Artwork',
      unit_price_cents: unitPriceCents,
      quantity,
      line_total_cents: totalCents
    })

    if (itemError) {
      return NextResponse.json({ error: itemError.message }, { status: 500 })
    }

    const baseUrl = getBaseUrl(request)
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
    const preference = await mercadoPagoPreference.create({
      body: {
        items: [
          {
            id: product.id,
            title: product.name || 'Artwork',
            quantity,
            currency_id: 'BRL',
            unit_price: Number((unitPriceCents / 100).toFixed(2))
          }
        ],
        payer: {
          email: user.email
        },
        external_reference: order.id,
        ...(isLocalhost ? {} : { notification_url: `${baseUrl}/api/webhooks/mercadopago` }),
        metadata: {
          order_id: order.id,
          user_id: user.id,
          product_id: product.id
        },
        statement_descriptor: 'NATHALIAARTE',
        ...(isLocalhost
          ? {}
          : {
              back_urls: {
                success: `${baseUrl}/checkout/success`,
                pending: `${baseUrl}/checkout/pending`,
                failure: `${baseUrl}/checkout/failure`
              },
              auto_return: 'approved' as const
            })
      }
    })

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        mp_preference_id: preference.id,
        mp_init_point: preference.init_point
      })
      .eq('id', order.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      orderId: order.id,
      init_point: preference.init_point
    })
  } catch (error) {
    console.error('checkout product failed', error)
    const errorObj = error as { message?: string; status?: number; cause?: { message?: string } }
    const message = errorObj?.cause?.message || errorObj?.message || 'Checkout failed'
    return NextResponse.json({ error: message }, { status: errorObj?.status || 500 })
  }
}
