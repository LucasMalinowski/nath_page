export type CouponDiscountType = 'percentage' | 'fixed'

export type CouponRecord = {
  id: string
  code: string
  discount_percent: number | null
  discount_type: CouponDiscountType | null
  discount_value_cents: number | null
  is_active: boolean | null
  expires_at: string | null
  max_uses: number | null
  uses_count: number | null
  created_at: string | null
  updated_at: string | null
}

export type CouponPreview = {
  coupon: CouponRecord
  discountCents: number
}

export function normalizeCouponCode(value: string | null | undefined) {
  return (value || '').trim().toUpperCase()
}

export function getCouponDiscountType(coupon: CouponRecord): CouponDiscountType {
  return coupon.discount_type === 'fixed' ? 'fixed' : 'percentage'
}

export function isCouponExpired(coupon: CouponRecord, referenceDate = new Date()) {
  if (!coupon.expires_at) return false
  return new Date(coupon.expires_at).getTime() <= referenceDate.getTime()
}

export function isCouponUsageExhausted(coupon: CouponRecord) {
  if (coupon.max_uses == null) return false
  return (coupon.uses_count || 0) >= coupon.max_uses
}

export function calculateCouponDiscountCents(coupon: CouponRecord, subtotalCents: number) {
  if (!Number.isFinite(subtotalCents) || subtotalCents <= 0) {
    return 0
  }

  const discountType = getCouponDiscountType(coupon)
  if (discountType === 'fixed') {
    return Math.min(Math.max(coupon.discount_value_cents || 0, 0), subtotalCents)
  }

  const percent = Math.max(0, Math.min(100, coupon.discount_percent || 0))
  return Math.min(subtotalCents, Math.round((subtotalCents * percent) / 100))
}

export function describeCouponDiscount(coupon: CouponRecord) {
  const discountType = getCouponDiscountType(coupon)

  if (discountType === 'fixed') {
    const amount = Math.max(coupon.discount_value_cents || 0, 0) / 100
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  return `${coupon.discount_percent || 0}%`
}

export function getCouponStatusLabel(coupon: CouponRecord) {
  if (!coupon.is_active) return 'Inativo'
  if (isCouponExpired(coupon)) return 'Expirado'
  if (isCouponUsageExhausted(coupon)) return 'Esgotado'
  return 'Ativo'
}

