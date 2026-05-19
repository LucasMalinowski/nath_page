import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendAbandonedCartEmail } from '@/lib/mailer'
import { formatCentsToBRL, parseBrazilianPriceToCents } from '@/lib/price'
import { captureServerEvent, captureServerException } from '@/lib/posthog-server'

export const runtime = 'nodejs'

const DEFAULT_ABANDONMENT_HOURS = 4
const DEFAULT_RECIPIENT = 'malinowskinathalia@gmail.com'

type CartRow = {
  id: string
  user_id: string
  quantity: number
  created_at: string | null
  updated_at: string | null
  product:
    | {
        id: string
        name: string | null
        price_text: string | null
      }
    | {
        id: string
        name: string | null
        price_text: string | null
      }[]
    | null
}

type UserProfile = {
  id: string
  full_name: string | null
  phone: string | null
}

type NotificationRow = {
  user_id: string
  notified_cart_updated_at: string
}

function getSupabaseServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase server credentials')
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

function getBaseUrl(request: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (envUrl) return envUrl.replace(/\/$/, '')

  const requestUrl = new URL(request.url)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || requestUrl.host
  const proto = request.headers.get('x-forwarded-proto') || requestUrl.protocol.replace(':', '') || 'https'
  return `${proto}://${host}`
}

function toTime(timestamp: string | null | undefined) {
  const time = timestamp ? new Date(timestamp).getTime() : 0
  return Number.isFinite(time) ? time : 0
}

function getProduct(row: CartRow) {
  if (Array.isArray(row.product)) return row.product[0] || null
  return row.product
}

function isNotified(notification: NotificationRow | undefined, cartUpdatedAt: string) {
  if (!notification) return false
  return toTime(notification.notified_cart_updated_at) >= toTime(cartUpdatedAt)
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    console.error('[cart-abandonment] CRON_SECRET env var is not set')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()
  const abandonmentHours = Number(process.env.CART_ABANDONMENT_HOURS || DEFAULT_ABANDONMENT_HOURS)
  const cutoff = Date.now() - Math.max(1, abandonmentHours) * 60 * 60 * 1000
  const recipient = process.env.CART_ABANDONMENT_EMAIL || DEFAULT_RECIPIENT
  const baseUrl = getBaseUrl(request)

  const { data: cartRows, error: cartError } = await supabase
    .from('cart_items')
    .select('id, user_id, quantity, created_at, updated_at, product:gallery_products(id, name, price_text)')

  if (cartError) {
    return NextResponse.json({ error: cartError.message }, { status: 500 })
  }

  const cartsByUser = new Map<string, CartRow[]>()
  for (const row of ((cartRows || []) as unknown as CartRow[])) {
    if (!row.user_id) continue
    const rows = cartsByUser.get(row.user_id) || []
    rows.push(row)
    cartsByUser.set(row.user_id, rows)
  }

  const abandoned = Array.from(cartsByUser.entries())
    .map(([userId, rows]) => {
      const cartUpdatedAt = new Date(
        Math.max(...rows.map((row) => Math.max(toTime(row.updated_at), toTime(row.created_at))))
      ).toISOString()

      return { userId, rows, cartUpdatedAt }
    })
    .filter((cart) => toTime(cart.cartUpdatedAt) <= cutoff)

  if (!abandoned.length) {
    return NextResponse.json({ ok: true, scanned_users: cartsByUser.size, emailed: 0 })
  }

  const userIds = abandoned.map((cart) => cart.userId)

  const { data: profiles, error: profilesError } = await supabase
    .from('users')
    .select('id, full_name, phone')
    .in('id', userIds)

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 })
  }

  const { data: notifications, error: notificationsError } = await supabase
    .from('cart_abandonment_notifications')
    .select('user_id, notified_cart_updated_at')
    .in('user_id', userIds)

  if (notificationsError) {
    return NextResponse.json({ error: notificationsError.message }, { status: 500 })
  }

  const { data: pendingOrders, error: pendingOrdersError } = await supabase
    .from('orders')
    .select('user_id')
    .in('user_id', userIds)
    .eq('status', 'pending')

  if (pendingOrdersError) {
    return NextResponse.json({ error: pendingOrdersError.message }, { status: 500 })
  }

  const profileById = new Map((profiles || []).map((profile) => [profile.id, profile as UserProfile]))
  const notificationByUser = new Map((notifications || []).map((notification) => [notification.user_id, notification as NotificationRow]))
  const pendingOrdersByUser = new Map<string, number>()
  for (const order of (pendingOrders || []) as { user_id: string }[]) {
    pendingOrdersByUser.set(order.user_id, (pendingOrdersByUser.get(order.user_id) || 0) + 1)
  }

  let emailed = 0
  const errors: string[] = []

  for (const cart of abandoned) {
    if (isNotified(notificationByUser.get(cart.userId), cart.cartUpdatedAt)) continue

    const authUser = await supabase.auth.admin.getUserById(cart.userId)
    const userEmail = authUser.data.user?.email

    if (!userEmail) {
      errors.push(`Missing email for user ${cart.userId}`)
      continue
    }

    const items = cart.rows.map((row) => {
      const product = getProduct(row)
      const unitPriceCents = parseBrazilianPriceToCents(product?.price_text)
      return {
        productName: product?.name || 'Obra',
        quantity: row.quantity,
        unitPriceText: formatCentsToBRL(unitPriceCents),
        lineTotalText: formatCentsToBRL(unitPriceCents * row.quantity),
        unitPriceCents,
        productId: product?.id || null
      }
    })

    const subtotalCents = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0)
    const profile = profileById.get(cart.userId)
    const pendingOrdersCount = pendingOrdersByUser.get(cart.userId) || 0

    try {
      const emailSent = await sendAbandonedCartEmail({
        to: recipient,
        userEmail,
        fullName: profile?.full_name,
        phone: profile?.phone,
        userId: cart.userId,
        cartUpdatedAt: cart.cartUpdatedAt,
        cartUrl: `${baseUrl}/carrinho`,
        subtotalText: formatCentsToBRL(subtotalCents),
        items,
        pendingOrdersCount
      })

      if (!emailSent) {
        throw new Error('SMTP not configured; abandoned cart email was not sent')
      }

      const snapshot = {
        user_email: userEmail,
        full_name: profile?.full_name || null,
        phone: profile?.phone || null,
        cart_updated_at: cart.cartUpdatedAt,
        subtotal_cents: subtotalCents,
        pending_orders_count: pendingOrdersCount,
        items: items.map(({ unitPriceCents, ...item }) => item)
      }

      const { error: notificationError } = await supabase
        .from('cart_abandonment_notifications')
        .upsert(
          {
            user_id: cart.userId,
            notified_cart_updated_at: cart.cartUpdatedAt,
            notified_at: new Date().toISOString(),
            cart_snapshot: snapshot
          },
          { onConflict: 'user_id' }
        )

      if (notificationError) {
        errors.push(notificationError.message)
        continue
      }

      emailed += 1
      await captureServerEvent('cart_abandonment_admin_notified', cart.userId, {
        user_email: userEmail,
        subtotal_cents: subtotalCents,
        item_count: cart.rows.length,
        total_quantity: cart.rows.reduce((sum, row) => sum + row.quantity, 0),
        pending_orders_count: pendingOrdersCount,
        cart_updated_at: cart.cartUpdatedAt
      })
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
      await captureServerException('cart_abandonment_email_failed', cart.userId, error, {
        cart_updated_at: cart.cartUpdatedAt
      })
    }
  }

  return NextResponse.json({
    ok: errors.length === 0,
    scanned_users: cartsByUser.size,
    abandoned_users: abandoned.length,
    emailed,
    errors
  })
}
