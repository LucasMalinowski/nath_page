import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.SUPERFRETE_WEBHOOK_SECRET
  if (!secret) return true
  if (!signature) return false

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-me-signature') || request.headers.get('x-superfrete-signature')

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = rawBody ? JSON.parse(rawBody) : {}
  const orderId = String(payload?.id || payload?.order?.id || '')
  if (!orderId) {
    return NextResponse.json({ received: true })
  }

  const supabaseAdmin = getSupabaseAdmin()
  const trackingCode = payload?.tracking || payload?.tracking_code || payload?.order?.tracking || null
  const trackingUrl = payload?.tracking_url || payload?.order?.tracking_url || null
  const status = payload?.status || payload?.shipping_status || payload?.order?.status || null

  await supabaseAdmin
    .from('orders')
    .update({
      shipping_status: status,
      shipping_tracking_code: trackingCode,
      shipping_tracking_url: trackingUrl,
      superfrete_order_data: payload,
      updated_at: new Date().toISOString()
    })
    .eq('superfrete_order_id', orderId)

  return NextResponse.json({ received: true })
}
