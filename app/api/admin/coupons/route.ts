import { NextResponse } from 'next/server'
import { parseBrazilianPriceToCents } from '@/lib/price'
import { normalizeCouponCode } from '@/lib/coupons'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

type CouponWriteBody = {
  code?: string
  discountType?: 'percentage' | 'fixed'
  discountPercent?: number | string | null
  discountValue?: number | string | null
  expiresAt?: string | null
  maxUses?: number | string | null
  isActive?: boolean
}

function parseOptionalInteger(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) ? parsed : null
}

function parseOptionalDate(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function buildCouponPayload(body: CouponWriteBody) {
  const code = normalizeCouponCode(body.code)
  const discountType = body.discountType === 'fixed' ? 'fixed' : 'percentage'
  const maxUses = parseOptionalInteger(body.maxUses)
  const expiresAt = parseOptionalDate(body.expiresAt)

  if (!code) {
    throw new Error('Coupon code is required')
  }

  if (maxUses !== null && maxUses <= 0) {
    throw new Error('Max uses must be greater than zero')
  }

  if (discountType === 'fixed') {
    const discountValue = parseBrazilianPriceToCents(String(body.discountValue ?? ''))
    if (discountValue <= 0) {
      throw new Error('Fixed discount value is required')
    }

    return {
      code,
      discount_type: discountType,
      discount_percent: null,
      discount_value_cents: discountValue,
      expires_at: expiresAt,
      max_uses: maxUses,
      is_active: body.isActive ?? true,
      uses_count: 0,
      updated_at: new Date().toISOString()
    }
  }

  const discountPercent = parseOptionalInteger(body.discountPercent)
  if (discountPercent === null || discountPercent <= 0 || discountPercent > 100) {
    throw new Error('Percentage discount must be between 1 and 100')
  }

  return {
    code,
    discount_type: discountType,
    discount_percent: discountPercent,
    discount_value_cents: null,
    expires_at: expiresAt,
    max_uses: maxUses,
    is_active: body.isActive ?? true,
    uses_count: 0,
    updated_at: new Date().toISOString()
  }
}

export async function GET(request: Request) {
  try {
    const { supabaseAdmin } = await requireAdmin(request)
    const { data: coupons, error } = await supabaseAdmin.from('coupons').select('*').order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ coupons: coupons || [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load coupons'
    const status = message === 'Authentication required' ? 401 : message === 'Admin access required' ? 403 : 400
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: Request) {
  try {
    const { supabaseAdmin } = await requireAdmin(request)
    const body = (await request.json().catch(() => ({}))) as CouponWriteBody
    const payload = buildCouponPayload(body)
    const { data: coupon, error } = await supabaseAdmin.from('coupons').insert(payload).select('*').single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ coupon })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create coupon'
    const status = message === 'Authentication required' ? 401 : message === 'Admin access required' ? 403 : 400
    return NextResponse.json({ error: message }, { status })
  }
}

