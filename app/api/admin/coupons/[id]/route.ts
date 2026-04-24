import { NextResponse } from 'next/server'
import { parseBrazilianPriceToCents } from '@/lib/price'
import { normalizeCouponCode } from '@/lib/coupons'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

type CouponPatchBody = {
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
  if (value === null || value === undefined) return undefined
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid expiration date')
  }
  return date.toISOString()
}

function buildUpdatePayload(body: CouponPatchBody, existing: any) {
  const code = body.code !== undefined ? normalizeCouponCode(body.code) : existing.code
  if (!code) {
    throw new Error('Coupon code is required')
  }

  const discountType = body.discountType === 'fixed' ? 'fixed' : body.discountType === 'percentage' ? 'percentage' : existing.discount_type || 'percentage'
  const maxUses = body.maxUses !== undefined ? parseOptionalInteger(body.maxUses) : existing.max_uses
  const isActive = body.isActive !== undefined ? body.isActive : existing.is_active
  const expiresAt = parseOptionalDate(body.expiresAt)

  if (maxUses !== null && maxUses !== undefined && maxUses <= 0) {
    throw new Error('Max uses must be greater than zero')
  }

  if (discountType === 'fixed') {
    const discountValue =
      body.discountValue !== undefined ? parseBrazilianPriceToCents(String(body.discountValue ?? '')) : existing.discount_value_cents
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      throw new Error('Fixed discount value is required')
    }

    return {
      code,
      discount_type: discountType,
      discount_percent: null,
      discount_value_cents: discountValue,
      expires_at: expiresAt === undefined ? existing.expires_at : expiresAt,
      max_uses: maxUses,
      is_active: isActive,
      updated_at: new Date().toISOString()
    }
  }

  const discountPercent =
    body.discountPercent !== undefined ? parseOptionalInteger(body.discountPercent) : existing.discount_percent
  if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
    throw new Error('Percentage discount must be between 1 and 100')
  }

  return {
    code,
    discount_type: discountType,
    discount_percent: discountPercent,
    discount_value_cents: null,
    expires_at: expiresAt === undefined ? existing.expires_at : expiresAt,
    max_uses: maxUses,
    is_active: isActive,
    updated_at: new Date().toISOString()
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { supabaseAdmin } = await requireAdmin(request)
    const { id } = params
    const body = (await request.json().catch(() => ({}))) as CouponPatchBody

    const { data: existing, error: existingError } = await supabaseAdmin.from('coupons').select('*').eq('id', id).maybeSingle()
    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 400 })
    }
    if (!existing) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    }

    const payload = buildUpdatePayload(body, existing)

    if (payload.max_uses !== null && payload.max_uses !== undefined && existing.uses_count > payload.max_uses) {
      return NextResponse.json({ error: 'Max uses cannot be lower than the current usage count' }, { status: 400 })
    }

    const { data: coupon, error } = await supabaseAdmin.from('coupons').update(payload).eq('id', id).select('*').single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ coupon })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update coupon'
    const status = message === 'Authentication required' ? 401 : message === 'Admin access required' ? 403 : 400
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { supabaseAdmin } = await requireAdmin(request)
    const { id } = params
    const { error } = await supabaseAdmin.from('coupons').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not delete coupon'
    const status = message === 'Authentication required' ? 401 : message === 'Admin access required' ? 403 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
