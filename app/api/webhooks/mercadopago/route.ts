import { NextResponse } from 'next/server'
import { getMercadoPagoPayment } from '@/lib/mercadopago'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { sendPaymentSuccessEmail } from '@/lib/mailer'
import { getCheckoutProfile, purchaseShippingLabel } from '@/lib/order-shipping'
import { isSuperFreteConfigured } from '@/lib/superfrete'

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
      .select('id, user_id, status, shipping_service_code')
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
        .select(
          'product_id, quantity, product_name, product:gallery_products(id, name, price_text, quantity, package_weight_grams, package_height_cm, package_width_cm, package_length_cm)'
        )
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

      const { data: authUserData, error: authUserError } = await supabaseAdmin.auth.admin.getUserById(order.user_id)
      const buyerEmail = authUserData.user?.email
      let shippingResult: Awaited<ReturnType<typeof purchaseShippingLabel>> | null = null

      if (order.shipping_service_code && buyerEmail && isSuperFreteConfigured()) {
        try {
          const profile = await getCheckoutProfile(order.user_id)
          shippingResult = await purchaseShippingLabel({
            orderId: order.id,
            buyerEmail,
            profile,
            serviceCode: order.shipping_service_code,
            items: (orderItems || [])
              .map((item) => ({
                quantity: item.quantity,
                product: Array.isArray(item.product) ? item.product[0] : item.product
              }))
              .filter((item): item is { quantity: number; product: NonNullable<typeof item.product> } => !!item.product)
          })
        } catch (shippingError) {
          const message = shippingError instanceof Error ? shippingError.message : 'Could not purchase shipping label'
          console.error('Failed to create SuperFrete label', shippingError)
          await supabaseAdmin
            .from('orders')
            .update({
              shipping_status: 'error',
              shipping_error_message: message,
              updated_at: new Date().toISOString()
            })
            .eq('id', order.id)
        }
      }

      if (authUserError) {
        console.warn('Could not load buyer email for payment success notification', authUserError.message)
      } else if (buyerEmail) {
        try {
          await sendPaymentSuccessEmail({
            to: buyerEmail,
            orderId: order.id,
            productNames: (orderItems || [])
              .map((item) => item.product_name)
              .filter((name): name is string => !!name),
            trackingCode: shippingResult?.shipping_tracking_code,
            trackingUrl: shippingResult?.shipping_tracking_url
          })
        } catch (mailError) {
          console.error('Failed to send payment success email', mailError)
        }
      }
    }

    return NextResponse.json({ received: true, product_ids: approvedProductIds })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
