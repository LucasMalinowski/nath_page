'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPinHouse, ShoppingCart, TicketPercent, Trash2, Truck } from 'lucide-react'
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
    description: string | null
    author: string | null
    price_text: string | null
    images: string[] | string | null
  } | null
}

type ShippingOption = {
  serviceCode: number
  serviceName: string
  carrierName: string
  priceCents: number
  deliveryDays: number
}

type ProfileSummary = {
  full_name: string | null
  postal_code: string | null
  city: string | null
  state: string | null
  address_line1: string | null
  address_number: string | null
}

const parseImages = (item: { images?: string | string[] | null }): string[] => {
  if (!item.images) return []
  if (Array.isArray(item.images)) return item.images

  try {
    const parsed = JSON.parse(item.images)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function CarrinhoPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingError, setShippingError] = useState<string | null>(null)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShippingCode, setSelectedShippingCode] = useState<number | null>(null)
  const [profile, setProfile] = useState<ProfileSummary | null>(null)

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
      .select('id, quantity, product:gallery_products(id, name, description, author, price_text, images)')
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

  const loadProfileAndShipping = useCallback(async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return
    }

    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('full_name, postal_code, city, state, address_line1, address_number')
      .eq('id', session.user.id)
      .maybeSingle()

    if (profileError) {
      setShippingError(profileError.message)
      return
    }

    setProfile((profileData || null) as ProfileSummary | null)

    if (!items.length) {
      setShippingOptions([])
      setSelectedShippingCode(null)
      return
    }

    setLoadingShipping(true)
    setShippingError(null)

    const response = await fetch('/api/shipping/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      }
    })
    const data = await response.json()
    setLoadingShipping(false)

    if (!response.ok) {
      setShippingOptions([])
      setSelectedShippingCode(null)
      setShippingError(data.error || 'Não foi possível calcular o frete.')
      return
    }

    const options = (data.options || []) as ShippingOption[]
    setShippingOptions(options)
    setSelectedShippingCode((current) => {
      if (current && options.some((option) => option.serviceCode === current)) return current
      return options[0]?.serviceCode ?? null
    })
  }, [items])

  useEffect(() => {
    void loadProfileAndShipping()
  }, [loadProfileAndShipping])

  const subtotalCents = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = parseBrazilianPriceToCents(item.product?.price_text)
      return sum + price * item.quantity
    }, 0)
  }, [items])

  const selectedShipping = useMemo(
    () => shippingOptions.find((option) => option.serviceCode === selectedShippingCode) || null,
    [selectedShippingCode, shippingOptions]
  )

  const totalCents = subtotalCents + (selectedShipping?.priceCents || 0)

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
        couponCode: couponCode.trim() || undefined,
        shippingServiceCode: selectedShippingCode || undefined
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
      <main className="min-h-screen bg-[#f5f1eb] text-[#3b2f26] page-fade-in">
        <Navbar />
        <section className="min-h-screen pt-28 px-6 sm:px-8 lg:px-16">
          <p className="text-[#735746] font-sans">Carregando carrinho...</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#3b2f26] page-fade-in">
      <Navbar />

      <section className="pt-28 pb-16 px-6 sm:px-8 lg:px-16 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-serif text-[#b89b5e]">Carrinho</h1>
              <p className="mt-2 text-[#735746] font-sans">Finalize suas obras com frete calculado antes do pagamento.</p>
            </div>
            <a href="/galeria" className="text-sm text-[#735746] hover:text-[#b89b5e] transition-colors">
              Voltar para galeria
            </a>
          </div>

          {!items.length && (
            <div className="border border-[#d8cdbf] bg-[#f6f2ed] p-8 text-center">
              <ShoppingCart className="mx-auto mb-3 text-[#b89b5e]" />
              <p className="font-sans text-[#735746]">Seu carrinho está vazio.</p>
            </div>
          )}

          {!!items.length && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
              <div className="space-y-4">
                {items.map((item) => {
                  const productImages = parseImages(item.product || {})
                  const coverImage = productImages[0]

                  return (
                    <article key={item.id} className="border border-[#d8cdbf] bg-[#f6f2ed] p-4 sm:p-5">
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative h-40 overflow-hidden border border-[#ddd2c4] bg-[#ede4d9] sm:h-auto sm:w-36 sm:shrink-0">
                          {coverImage ? (
                            <Image
                              src={coverImage}
                              alt={item.product?.name || 'Obra'}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 144px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[#8b7567]">
                              Imagem indisponivel
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xl font-serif text-[#3b2f26]">{item.product?.name || 'Obra'}</p>
                              {item.product?.author && (
                                <p className="mt-1 text-sm font-sans uppercase tracking-[0.12em] text-[#8a6f5f]">
                                  {item.product.author}
                                </p>
                              )}
                              {item.product?.description && (
                                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#735746] font-sans">
                                  {item.product.description}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-[#9a7e6f] hover:text-[#7d6153] transition-colors"
                              aria-label="Remover item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="mt-4 grid gap-4 border-t border-[#ddd2c4] pt-4 sm:grid-cols-[auto_1fr_auto] sm:items-end">
                            <div>
                              <p className="text-xs uppercase tracking-[0.14em] text-[#8a6f5f]">Preco unitario</p>
                              <p className="mt-1 text-base font-sans text-[#3b2f26]">
                                {item.product?.price_text ? `R$ ${item.product.price_text}` : 'R$ 0,00'}
                              </p>
                            </div>

                            <div className="justify-self-start sm:justify-self-center">
                              <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[#8a6f5f]">Quantidade</p>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="border border-[#d5ccb9] text-[#735746] px-3 py-1 hover:bg-[#efe7dc] transition-colors"
                                >
                                  -
                                </button>
                                <span className="min-w-8 text-center text-[#3b2f26]">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="border border-[#d5ccb9] text-[#735746] px-3 py-1 hover:bg-[#efe7dc] transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="sm:text-right">
                              <p className="text-xs uppercase tracking-[0.14em] text-[#8a6f5f]">Total do item</p>
                              <p className="mt-1 text-lg font-sans text-[#3b2f26]">
                                {formatCentsToBRL(parseBrazilianPriceToCents(item.product?.price_text) * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                  </article>
                  )
                })}
              </div>

              <aside className="border border-[#d8cdbf] bg-[#f6f2ed] p-5 h-fit">
                <div className="mb-5 rounded-[18px] border border-[#d8cdbf] bg-white/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="inline-flex items-center gap-2 text-sm text-[#735746]">
                        <MapPinHouse size={16} className="text-[#b89b5e]" />
                        Entrega
                      </p>
                      {profile?.address_line1 && profile?.address_number ? (
                        <p className="mt-2 text-sm leading-relaxed text-[#3b2f26]">
                          {profile.address_line1}, {profile.address_number}
                          <br />
                          {profile.city || 'Cidade'}, {profile.state || 'UF'} • {profile.postal_code || 'CEP'}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm leading-relaxed text-[#735746]">
                          Complete seu endereço para calcular o frete.
                        </p>
                      )}
                    </div>

                    <Link href="/conta" className="text-sm text-[#735746] transition-colors hover:text-[#b89b5e]">
                      Editar
                    </Link>
                  </div>
                </div>

                <div className="mb-5 rounded-[18px] border border-[#d8cdbf] bg-white/80 p-4">
                  <p className="inline-flex items-center gap-2 text-sm text-[#735746]">
                    <Truck size={16} className="text-[#b89b5e]" />
                    Frete
                  </p>

                  {loadingShipping && <p className="mt-3 text-sm text-[#735746]">Calculando opções...</p>}

                  {!loadingShipping && shippingOptions.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.serviceCode}
                          className={`block cursor-pointer rounded-[14px] border px-4 py-3 transition-colors ${
                            option.serviceCode === selectedShippingCode
                              ? 'border-[#b89b5e] bg-[#f8f2e8]'
                              : 'border-[#d8cdbf] bg-[#fbf8f2]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={option.serviceCode === selectedShippingCode}
                              onChange={() => setSelectedShippingCode(option.serviceCode)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="text-sm font-medium text-[#3b2f26]">{option.serviceName}</p>
                                  <p className="text-xs uppercase tracking-[0.14em] text-[#8a6f5f]">
                                    {option.carrierName || 'SuperFrete'}
                                  </p>
                                </div>
                                <p className="text-sm font-medium text-[#3b2f26]">{formatCentsToBRL(option.priceCents)}</p>
                              </div>
                              <p className="mt-1 text-sm text-[#735746]">
                                {option.deliveryDays > 0 ? `${option.deliveryDays} dia(s) úteis estimados` : 'Prazo sob consulta'}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {!loadingShipping && shippingOptions.length === 0 && !shippingError && (
                    <p className="mt-3 text-sm text-[#735746]">Nenhuma opção de frete disponível no momento.</p>
                  )}
                </div>

                <label className="text-sm text-[#735746] mb-2 flex items-center gap-2">
                  <TicketPercent size={16} className="text-[#b89b5e]" />
                  Cupom
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="EXEMPLO10"
                  className="w-full border border-[#d5ccb9] bg-white rounded px-3 py-2 mb-5 text-[#3b2f26] placeholder:text-[#b0907a]"
                />

                <div className="space-y-2 text-sm text-[#735746] font-sans">
                  <div className="flex items-center justify-between">
                    <span>Produtos</span>
                    <span className="text-[#3b2f26]">{formatCentsToBRL(subtotalCents)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Frete</span>
                    <span className="text-[#3b2f26]">
                      {selectedShipping ? formatCentsToBRL(selectedShipping.priceCents) : 'Selecione'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#ddd2c4] pt-2 text-base">
                    <span>Total</span>
                    <span className="text-[#3b2f26]">{formatCentsToBRL(totalCents)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={checkout}
                  disabled={checkingOut || !selectedShippingCode}
                  className="mt-6 w-full bg-[#735746] text-[#f5f1eb] rounded-sm px-4 py-3 font-medium hover:bg-[#644435] transition-colors disabled:opacity-60"
                >
                  {checkingOut ? 'Redirecionando...' : 'Finalizar com Mercado Pago'}
                </button>
              </aside>
            </div>
          )}

          {error && <p className="mt-6 text-sm text-[#a16060]">{error}</p>}
          {shippingError && <p className="mt-3 text-sm text-[#a16060]">{shippingError}</p>}
        </div>
      </section>

      <Footer contactInfo={false} />
    </main>
  )
}
