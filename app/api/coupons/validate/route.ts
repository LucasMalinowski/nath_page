import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { calculateCouponDiscountCents, isCouponExpired, isCouponUsageExhausted, normalizeCouponCode } from '@/lib/coupons'
import { resolveRequestUser } from '@/lib/admin-auth'

export const runtime = 'nodejs'

type CouponValidateBody = {
  code?: string
  subtotalCents?: number
}

export async function POST(request: Request) {
  try {
    await resolveRequestUser(request)

    const body = (await request.json().catch(() => ({}))) as CouponValidateBody
    const code = normalizeCouponCode(body.code)
    const subtotalCents = Number(body.subtotalCents)

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    if (!Number.isFinite(subtotalCents) || subtotalCents < 0) {
      return NextResponse.json({ error: 'Invalid subtotal' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data: coupon, error } = await supabaseAdmin.from('coupons').select('*').eq('code', code).maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 })
    }

    if (!coupon.is_active || isCouponExpired(coupon) || isCouponUsageExhausted(coupon)) {
      return NextResponse.json(
        {
          error: isCouponUsageExhausted(coupon) ? 'Coupon usage limit reached' : 'Invalid or expired coupon'
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      coupon,
      discountCents: calculateCouponDiscountCents(coupon, subtotalCents)
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not validate coupon'
    const status = message === 'Authentication required' ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}

