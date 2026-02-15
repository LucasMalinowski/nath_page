import { NextResponse } from 'next/server'
import { getMercadoPagoPayment } from '@/lib/mercadopago'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

type MercadoPagoWebhookBody = {
  action?: string
  api_version?: string
  data?: {
    id?: string | number
  }
  id?: string | number
  live_mode?: boolean
  type?: string
}

function resolvePaymentId(url: URL, body: MercadoPagoWebhookBody): string | null {
  const fromQuery = url.searchParams.get('data.id')
  if (fromQuery) return fromQuery
  if (body?.data?.id) return String(body.data.id)
  if (body?.id && body?.type === 'payment') return String(body.id)
  return null
}

function resolveStatus(status: string | undefined): 'pending' | 'paid' | 'failed' | 'cancelled' {
  if (status === 'approved') return 'paid'
  if (status === 'cancelled') return 'cancelled'
  if (status === 'rejected') return 'failed'
  return 'pending'
}

export async function POST(request: Request) {
  try {
    const mercadoPagoPayment = getMercadoPagoPayment()
    const supabaseAdmin = getSupabaseAdmin()
    const url = new URL(request.url)
    const body = (await request.json().catch(() => ({}))) as MercadoPagoWebhookBody

    const topic =
      url.searchParams.get('type') || url.searchParams.get('topic') || body.type || body.action?.split('.')[0]

    if (topic !== 'payment') {
      return NextResponse.json({ received: true })
    }

    const paymentId = resolvePaymentId(url, body)
    if (!paymentId) {
      return NextResponse.json({ received: true })
    }

    const payment = await mercadoPagoPayment.get({ id: paymentId })
    const orderId = payment.external_reference || String(payment.metadata?.order_id || '')

    if (!orderId) {
      return NextResponse.json({ received: true })
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, user_id, status')
      .eq('id', orderId)
      .maybeSingle()

    if (orderError || !order) {
      return NextResponse.json({ received: true })
    }

    const nextStatus = resolveStatus(payment.status)

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: nextStatus,
        payment_status: payment.status,
        mp_payment_id: String(payment.id),
        mp_payment_data: payment,
        paid_at: payment.status === 'approved' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    let approvedProductIds: string[] = []

    if (payment.status === 'approved' && order.status !== 'paid') {
      const { data: orderItems, error: itemsError } = await supabaseAdmin
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', order.id)

      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 })
      }

      approvedProductIds = (orderItems || [])
        .map((item) => item.product_id)
        .filter((productId): productId is string => !!productId)

      for (const item of orderItems || []) {
        if (!item.product_id) continue

        const { data: product, error: productError } = await supabaseAdmin
          .from('gallery_products')
          .select('id, quantity')
          .eq('id', item.product_id)
          .single()

        if (productError) {
          return NextResponse.json({ error: productError.message }, { status: 500 })
        }

        const currentQuantity = product.quantity ?? 0
        const nextQuantity = Math.max(currentQuantity - item.quantity, 0)

        const { error: stockError } = await supabaseAdmin
          .from('gallery_products')
          .update({ quantity: nextQuantity })
          .eq('id', item.product_id)

        if (stockError) {
          return NextResponse.json({ error: stockError.message }, { status: 500 })
        }
      }

      await supabaseAdmin.from('cart_items').delete().eq('user_id', order.user_id)
    }

    return NextResponse.json({ received: true, product_ids: approvedProductIds })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
