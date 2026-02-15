import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getMercadoPagoPreference } from '@/lib/mercadopago'
import { parseBrazilianPriceToCents } from '@/lib/price'

export const runtime = 'nodejs'

type CheckoutBody = {
  couponCode?: string
}

type CartRow = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price_text: string | null
    is_visible: boolean | null
    quantity: number | null
  } | null
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
    const supabaseAdmin = getSupabaseAdmin()
    const mercadoPagoPreference = getMercadoPagoPreference()
    const supabase = createServerSupabaseClient()
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

    const body = (await request.json().catch(() => ({}))) as CheckoutBody
    const couponCode = body.couponCode?.trim().toUpperCase() || null

    const { data: cartRows, error: cartError } = await supabaseAdmin
      .from('cart_items')
      .select('id, quantity, product:gallery_products(id, name, price_text, is_visible, quantity)')
      .eq('user_id', user.id)

    if (cartError) {
      return NextResponse.json({ error: cartError.message }, { status: 400 })
    }

    const cart = (cartRows || []) as unknown as CartRow[]
    const validItems = cart.filter(
      (item) =>
        item.product &&
        item.product.is_visible !== false &&
        !!item.product.quantity &&
        item.product.quantity >= item.quantity
    )

    if (!validItems.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    if (validItems.length !== cart.length) {
      return NextResponse.json({ error: 'Some cart items are out of stock' }, { status: 400 })
    }

    let subtotalCents = 0
    const mpItems = validItems.map((item) => {
      const product = item.product!
      const unitPriceCents = parseBrazilianPriceToCents(product.price_text)
      subtotalCents += unitPriceCents * item.quantity

      return {
        id: product.id,
        title: product.name || 'Artwork',
        quantity: item.quantity,
        currency_id: 'BRL',
        unit_price: Number((unitPriceCents / 100).toFixed(2))
      }
    })

    let discountCents = 0
    let coupon: { code: string; discount_percent: number; expires_at: string | null } | null = null

    if (couponCode) {
      const { data: couponRow, error: couponError } = await supabaseAdmin
        .from('coupons')
        .select('code, discount_percent, expires_at')
        .eq('code', couponCode)
        .eq('is_active', true)
        .maybeSingle()

      if (couponError) {
        return NextResponse.json({ error: couponError.message }, { status: 400 })
      }

      if (!couponRow) {
        return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 })
      }
      if (couponRow.expires_at && new Date(couponRow.expires_at).getTime() <= Date.now()) {
        return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 })
      }

      coupon = couponRow
      discountCents = Math.round((subtotalCents * coupon.discount_percent) / 100)
    }

    const totalCents = Math.max(subtotalCents - discountCents, 0)

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        subtotal_cents: subtotalCents,
        discount_cents: discountCents,
        total_cents: totalCents,
        coupon_code: coupon?.code || null
      })
      .select('id')
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: orderError?.message || 'Could not create order' }, { status: 500 })
    }

    const orderItemsPayload = validItems.map((item) => {
      const product = item.product!
      const unitPriceCents = parseBrazilianPriceToCents(product.price_text)
      return {
        order_id: order.id,
        product_id: product.id,
        product_name: product.name || 'Artwork',
        unit_price_cents: unitPriceCents,
        quantity: item.quantity,
        line_total_cents: unitPriceCents * item.quantity
      }
    })

    const { error: orderItemsError } = await supabaseAdmin.from('order_items').insert(orderItemsPayload)
    if (orderItemsError) {
      return NextResponse.json({ error: orderItemsError.message }, { status: 500 })
    }

    const baseUrl = getBaseUrl(request)
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
    const preference = await mercadoPagoPreference.create({
      body: {
        items: mpItems,
        payer: {
          email: user.email
        },
        payment_methods: {
          installments: 12
        },
        external_reference: order.id,
        ...(isLocalhost ? {} : { notification_url: `${baseUrl}/api/webhooks/mercadopago` }),
        metadata: {
          order_id: order.id,
          user_id: user.id,
          coupon_code: coupon?.code || null,
          product_ids: validItems.map((item) => item.product!.id)
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
    console.error('checkout cart failed', error)
    const errorObj = error as { message?: string; status?: number; cause?: { message?: string } }
    const message = errorObj?.cause?.message || errorObj?.message || 'Checkout failed'
    return NextResponse.json({ error: message }, { status: errorObj?.status || 500 })
  }
}
