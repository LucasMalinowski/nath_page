'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, TicketPercent, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCentsToBRL, parseBrazilianPriceToCents } from '@/lib/price'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price_text: string | null
  } | null
}

export default function CarrinhoPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCart = useCallback(async () => {
    setLoading(true)
    setError(null)

    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session?.user) {
      router.push('/login?next=/carrinho')
      return
    }

    const { data, error: cartError } = await supabase
      .from('cart_items')
      .select('id, quantity, product:gallery_products(id, name, price_text)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    setLoading(false)
    if (cartError) {
      setError(cartError.message)
      return
    }

    setItems((data || []) as unknown as CartItem[])
  }, [router])

  useEffect(() => {
    void loadCart()
  }, [loadCart])

  const subtotalCents = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = parseBrazilianPriceToCents(item.product?.price_text)
      return sum + price * item.quantity
    }, 0)
  }, [items])

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) return
    const { error: updateError } = await supabase.from('cart_items').update({ quantity }).eq('id', cartItemId)
    if (updateError) {
      setError(updateError.message)
      return
    }
    await loadCart()
  }

  const removeItem = async (cartItemId: string) => {
    const { error: deleteError } = await supabase.from('cart_items').delete().eq('id', cartItemId)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await loadCart()
  }

  const checkout = async () => {
    setCheckingOut(true)
    setError(null)

    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session?.user) {
      setCheckingOut(false)
      router.push('/login?next=/carrinho')
      return
    }

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        couponCode: couponCode.trim() || undefined
      })
    })

    const data = await response.json()
    setCheckingOut(false)

    if (!response.ok) {
      setError(data.error || 'Could not start checkout')
      return
    }

    if (!data.init_point) {
      setError('Missing checkout URL')
      return
    }

    const link = document.createElement('a')
    link.href = data.init_point
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-dirt text-bg page-fade-in">
        <Navbar />
        <section className="texture-brown min-h-screen pt-28 px-6 sm:px-8 lg:px-16">
          <p className="text-bg/70 font-sans">Carregando carrinho...</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-dirt text-bg page-fade-in">
      <Navbar backgroundVariant="dirt" />

      <section className="texture-brown pt-28 pb-16 px-6 sm:px-8 lg:px-16 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl sm:text-5xl font-serif text-gold/90">Carrinho</h1>
              <p className="mt-2 text-bg/70 font-sans">Finalize suas obras com pagamento via Mercado Pago.</p>
            </div>
            <a href="/galeria" className="text-sm text-bg/80 hover:text-gold transition-colors">
              Voltar para galeria
            </a>
          </div>

          {!items.length && (
            <div className="border border-gold/40 bg-[#4B4038]/45 p-8 text-center">
              <ShoppingCart className="mx-auto mb-3 text-gold/80" />
              <p className="font-sans text-bg/80">Seu carrinho está vazio.</p>
            </div>
          )}

          {!!items.length && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
              <div className="space-y-4">
                {items.map((item) => (
                  <article key={item.id} className="border border-gold/45 bg-[#4B4038]/45 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xl font-serif text-bg/90">"{item.product?.name || 'Obra'}"</p>
                        <p className="text-sm text-bg/70 font-sans mt-1">
                          {item.product?.price_text ? `R$ ${item.product.price_text}` : 'R$ 0,00'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-bg/60 hover:text-red-300 transition-colors"
                        aria-label="Remover item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="border border-gold/50 text-bg px-3 py-1 hover:bg-gold/20 transition-colors"
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="border border-gold/50 text-bg px-3 py-1 hover:bg-gold/20 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-sans text-bg/85">
                        {formatCentsToBRL(parseBrazilianPriceToCents(item.product?.price_text) * item.quantity)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="border border-gold/45 bg-[#3b2f26]/70 p-5 h-fit">
                <label className="text-sm text-bg/80 mb-2 flex items-center gap-2">
                  <TicketPercent size={16} className="text-gold/80" />
                  Cupom
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="EXEMPLO10"
                  className="w-full border border-gold/40 bg-transparent rounded px-3 py-2 mb-5 text-bg"
                />

                <div className="space-y-2 text-sm text-bg/80 font-sans">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{formatCentsToBRL(subtotalCents)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={checkout}
                  disabled={checkingOut}
                  className="mt-6 w-full bg-gold text-[#3b2f26] rounded-sm px-4 py-3 font-medium hover:bg-[#e6c98a] transition-colors disabled:opacity-60"
                >
                  {checkingOut ? 'Redirecionando...' : 'Finalizar com Mercado Pago'}
                </button>
              </aside>
            </div>
          )}

          {error && <p className="mt-6 text-sm text-red-200">{error}</p>}
        </div>
      </section>

      <Footer contactInfo={false} />
    </main>
  )
}
