'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { BadgeDollarSign, Edit2, Loader2, Save, TicketPercent, Trash2, X } from 'lucide-react'
import { formatCentsToBRL, parseBrazilianPriceToCents } from '@/lib/price'
import { supabase, type Coupon } from '@/lib/supabase'
import {
  getCouponStatusLabel,
  normalizeCouponCode,
  calculateCouponDiscountCents as calculateDiscountCents,
  describeCouponDiscount
} from '@/lib/coupons'

type CouponFormState = {
  code: string
  discountType: 'percentage' | 'fixed'
  discountPercent: string
  discountValue: string
  expiresAt: string
  maxUses: string
  isActive: boolean
}

const emptyForm = (): CouponFormState => ({
  code: '',
  discountType: 'percentage',
  discountPercent: '',
  discountValue: '',
  expiresAt: '',
  maxUses: '',
  isActive: true
})

const toDatetimeLocalValue = (value: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const formatDateTime = (value: string | null) => {
  if (!value) return 'Sem expiração'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Data inválida'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

export default function CouponsTab() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CouponFormState>(emptyForm())
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const getAuthHeaders = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('Authentication required')
    }

    return {
      Authorization: `Bearer ${session.access_token}`
    }
  }

  const fetchCoupons = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/coupons', {
        headers: await getAuthHeaders()
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível carregar os cupons')
      }

      setCoupons((data.coupons || []) as Coupon[])
    } catch (fetchError) {
      setCoupons([])
      setError(fetchError instanceof Error ? fetchError.message : 'Não foi possível carregar os cupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchCoupons()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm())
  }

  const startEdit = (coupon: Coupon) => {
    setSuccess(null)
    setError(null)
    setEditingId(coupon.id)
    setForm({
      code: coupon.code,
      discountType: coupon.discount_type === 'fixed' ? 'fixed' : 'percentage',
      discountPercent: coupon.discount_percent != null ? String(coupon.discount_percent) : '',
      discountValue: coupon.discount_value_cents != null ? String(coupon.discount_value_cents / 100) : '',
      expiresAt: toDatetimeLocalValue(coupon.expires_at),
      maxUses: coupon.max_uses != null ? String(coupon.max_uses) : '',
      isActive: Boolean(coupon.is_active)
    })
  }

  const submitCoupon = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    const code = normalizeCouponCode(form.code)
    if (!code) {
      setError('Informe um código para o cupom')
      setSaving(false)
      return
    }

    const isFixed = form.discountType === 'fixed'
    const discountPercent = Number.parseInt(form.discountPercent, 10)
    const maxUses = form.maxUses.trim() ? Number.parseInt(form.maxUses, 10) : null
    const expiresAt = form.expiresAt ? new Date(form.expiresAt).toISOString() : null

    if (isFixed) {
      const parsedFixedValue = form.discountValue ? parseBrazilianPriceToCents(form.discountValue) : Number.NaN
      if (!Number.isFinite(parsedFixedValue) || parsedFixedValue <= 0) {
        setError('Informe um valor fixo válido em reais')
        setSaving(false)
        return
      }
    } else if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
      setError('Informe um percentual válido entre 1 e 100')
      setSaving(false)
      return
    }

    if (maxUses !== null && (!Number.isInteger(maxUses) || maxUses <= 0)) {
      setError('O limite de usos precisa ser um número inteiro maior que zero')
      setSaving(false)
      return
    }

    try {
      const authHeaders = await getAuthHeaders()
      const response = await fetch(editingId ? `/api/admin/coupons/${editingId}` : '/api/admin/coupons', {
        method: editingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          code,
          discountType: form.discountType,
          discountPercent: isFixed ? null : discountPercent,
          discountValue: isFixed ? form.discountValue : null,
          expiresAt,
          maxUses,
          isActive: form.isActive
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível salvar o cupom')
      }

      setSuccess(editingId ? 'Cupom atualizado com sucesso.' : 'Cupom criado com sucesso.')
      resetForm()
      await fetchCoupons()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível salvar o cupom')
    } finally {
      setSaving(false)
    }
  }

  const deleteCoupon = async (coupon: Coupon) => {
    if (!confirm(`Remover o cupom ${coupon.code}?`)) return

    setDeletingId(coupon.id)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'DELETE',
        headers: await getAuthHeaders()
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível remover o cupom')
      }

      if (editingId === coupon.id) {
        resetForm()
      }

      setSuccess('Cupom removido com sucesso.')
      await fetchCoupons()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Não foi possível remover o cupom')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-graphite">Cupons</h2>
        <p className="text-sm text-graphite/70 mt-1">Crie cupons de porcentagem ou valor fixo e acompanhe os usos.</p>
      </div>

      <div className="bg-white rounded-2xl border border-warm-beige/80 p-6 shadow-sm">
        <form onSubmit={submitCoupon} className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-graphite">
            <TicketPercent size={18} />
            {editingId ? 'Editar cupom' : 'Novo cupom'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="min-w-0">
              <label className="block text-sm font-medium text-graphite mb-1">Código *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: normalizeCouponCode(e.target.value) })}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white uppercase"
                placeholder="VERAO10"
                maxLength={32}
              />
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium text-graphite mb-1">Tipo de desconto *</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
              >
                <option value="percentage">Percentual</option>
                <option value="fixed">Valor fixo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.discountType === 'percentage' ? (
              <div className="min-w-0">
                <label className="block text-sm font-medium text-graphite mb-1">Percentual *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={form.discountPercent}
                  onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                  className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                  placeholder="10"
                />
              </div>
            ) : (
              <div className="min-w-0">
                <label className="block text-sm font-medium text-graphite mb-1">Valor fixo (R$) *</label>
                <input
                  type="text"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                  placeholder="25,00"
                />
              </div>
            )}

            <div className="min-w-0">
              <label className="block text-sm font-medium text-graphite mb-1">Expiração</label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="min-w-0">
              <label className="block text-sm font-medium text-graphite mb-1">Limite de usos</label>
              <input
                type="number"
                min="1"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green/60 bg-off-white"
                placeholder="Opcional"
              />
            </div>
            <label className="flex items-center gap-3 rounded-md border border-warm-beige bg-off-white px-3 py-2 text-sm text-graphite">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4"
              />
              Cupom ativo
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-olive-green hover:bg-coffee-brown text-off-white font-medium rounded-button transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Save className="mr-2" size={18} />}
              {editingId ? 'Salvar cupom' : 'Criar cupom'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center px-5 py-2.5 border border-warm-beige text-graphite font-medium rounded-button transition-colors hover:bg-warm-beige/40"
              >
                <X className="mr-2" size={18} />
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </div>

      {(error || success) && (
        <div className="mt-4 space-y-2">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-olive-green">{success}</p>}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-graphite/70">Carregando cupons...</p>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-warm-beige/80 shadow-sm">
            <p className="text-graphite text-lg mb-2">Nenhum cupom ainda.</p>
            <p className="text-sm text-graphite/60">Crie o primeiro cupom para liberar descontos no checkout.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {coupons.map((coupon) => {
              const statusLabel = getCouponStatusLabel(coupon)
              const usesCount = coupon.uses_count || 0
              const usesLabel = coupon.max_uses != null ? `${usesCount}/${coupon.max_uses}` : `${usesCount}/∞`
              const discountPreview = calculateDiscountCents(coupon, 10000)
              const discountValueLabel = describeCouponDiscount(coupon)

              return (
                <article
                  key={coupon.id}
                  className={`rounded-2xl border p-5 shadow-sm transition-all ${
                    editingId === coupon.id ? 'border-olive-green ring-2 ring-olive-green/30 bg-olive-green/5' : 'border-warm-beige/80 bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <BadgeDollarSign size={18} className="text-olive-green" />
                        <h3 className="text-xl font-serif text-graphite uppercase tracking-wide">{coupon.code}</h3>
                      </div>
                      <p className="mt-2 text-sm text-graphite/70">
                        {discountValueLabel} de desconto
                        {' • '}
                        {coupon.discount_type === 'fixed'
                          ? `até ${formatCentsToBRL(discountPreview)} em um pedido de R$ 100,00`
                          : `exemplo: ${formatCentsToBRL(discountPreview)} em um pedido de R$ 100,00`}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statusLabel === 'Ativo'
                          ? 'bg-olive-green/10 text-olive-green'
                          : 'bg-warm-beige/60 text-graphite/70'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-graphite/75 sm:grid-cols-2">
                    <p>Tipo: {coupon.discount_type === 'fixed' ? 'Valor fixo' : 'Percentual'}</p>
                    <p>Usos: {usesLabel}</p>
                    <p>Expira em: {formatDateTime(coupon.expires_at)}</p>
                    <p>Atualizado em: {formatDateTime(coupon.updated_at)}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(coupon)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-olive-green/10 text-olive-green rounded-md hover:bg-olive-green/20 transition-colors"
                    >
                      <Edit2 size={16} className="mr-2" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCoupon(coupon)}
                      disabled={deletingId === coupon.id}
                      className="inline-flex items-center justify-center px-4 py-2 border border-red-200 text-red-700 rounded-md hover:bg-red-50 transition-colors disabled:opacity-60"
                    >
                      {deletingId === coupon.id ? (
                        <Loader2 size={16} className="mr-2 animate-spin" />
                      ) : (
                        <Trash2 size={16} className="mr-2" />
                      )}
                      Remover
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
