'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronLeft, ChevronRight, Instagram, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase, GalleryProduct, GalleryExhibitor } from '@/lib/supabase'
import { MiniCarousel } from '@/components/MiniCarousel'

const parseImages = (item: { images?: string | string[] | null }): string[] => {
  if (!item.images) return []
  if (Array.isArray(item.images)) return item.images
  if (typeof item.images === 'string') {
    try {
      const parsed = JSON.parse(item.images)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

const formatPriceText = (price?: string | null): string => {
  if (!price) return '0,00'
  const value = price.trim()
  return value.includes(',') ? value : `${value},00`
}

export default function GaleriaPage() {
  const router = useRouter()
  const [products, setProducts] = useState<GalleryProduct[]>([])
  const [exhibitors, setExhibitors] = useState<GalleryExhibitor[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCartProductId, setAddingToCartProductId] = useState<string | null>(null)
  const [checkoutLoadingProductId, setCheckoutLoadingProductId] = useState<string | null>(null)
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null)
  const [currentExhibitorPage, setCurrentExhibitorPage] = useState(0)
  const [currentProductPage, setCurrentProductPage] = useState(0)
  const [exhibitorsPerPage, setExhibitorsPerPage] = useState(2)
  const productsPerPage = 3 // 2 rows of 3
  const productsPhrase = 'Uma seleção de peças autorais e obras de artistas independentes, escolhidas com intenção para dialogar com o espaço, o tempo e a identidade de quem habita.'

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: productsData } = await supabase
            .from('gallery_products')
            .select('*')
            .eq('is_visible', true)
            .gte('quantity', 1)
            .order('display_order', { ascending: true })

        const { data: exhibitorsData } = await supabase
            .from('gallery_exhibitors')
            .select('*')
            .eq('is_visible', true)
            .order('display_order', { ascending: true })

        setProducts(productsData || [])
        setExhibitors(exhibitorsData || [])
      } catch (error) {
        console.error('Error loading gallery data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setExhibitorsPerPage(2)
      } else {
        setExhibitorsPerPage(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const exhibitorsCarouselEnabled = exhibitors.length > 2
  const totalExhibitorPages = exhibitorsCarouselEnabled
      ? Math.ceil(exhibitors.length / exhibitorsPerPage)
      : 1

  const productsCarouselEnabled = products.length > productsPerPage
  const totalProductPages = Math.ceil(products.length / productsPerPage)

  useEffect(() => {
    if (currentExhibitorPage >= totalExhibitorPages) {
      setCurrentExhibitorPage(0)
    }
  }, [currentExhibitorPage, totalExhibitorPages])

  const visibleExhibitors = exhibitorsCarouselEnabled
      ? exhibitors.slice(
          currentExhibitorPage * exhibitorsPerPage,
          currentExhibitorPage * exhibitorsPerPage + exhibitorsPerPage
      )
      : exhibitors

  const visibleProducts = productsCarouselEnabled
      ? products.slice(
          currentProductPage * productsPerPage,
          currentProductPage * productsPerPage + productsPerPage
      )
      : products

  const nextExhibitorPage = () => {
    setCurrentExhibitorPage((prev) =>
        prev === totalExhibitorPages - 1 ? 0 : prev + 1
    )
  }

  const prevExhibitorPage = () => {
    setCurrentExhibitorPage((prev) =>
        prev === 0 ? totalExhibitorPages - 1 : prev - 1
    )
  }

  const nextProductPage = () => {
    if (currentProductPage < totalProductPages - 1) {
      setCurrentProductPage(prev => prev + 1)
    }
  }

  const prevProductPage = () => {
    if (currentProductPage > 0) {
      setCurrentProductPage(prev => prev - 1)
    }
  }

  const checkoutProduct = async (productId: string) => {
    setCheckoutLoadingProductId(productId)
    setCheckoutMessage(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      setCheckoutLoadingProductId(null)
      router.push('/login?next=/galeria')
      return
    }

    const response = await fetch('/api/checkout/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ productId, quantity: 1 })
    })
    const data = await response.json()
    setCheckoutLoadingProductId(null)

    if (!response.ok) {
      setCheckoutMessage(data.error || 'Não foi possível iniciar o checkout.')
      return
    }

    if (!data.init_point) {
      setCheckoutMessage('URL de checkout indisponível.')
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

  const addToCart = async (productId: string) => {
    setAddingToCartProductId(productId)
    setCheckoutMessage(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      setAddingToCartProductId(null)
      router.push('/login?next=/galeria')
      return
    }

    const { data: existingItem, error: existingItemError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', session.user.id)
      .eq('product_id', productId)
      .maybeSingle()

    if (existingItemError) {
      setAddingToCartProductId(null)
      setCheckoutMessage(existingItemError.message)
      return
    }

    if (existingItem?.id) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id)

      setAddingToCartProductId(null)
      if (updateError) {
        setCheckoutMessage(updateError.message)
        return
      }

      window.dispatchEvent(new Event('cart-updated'))
      setCheckoutMessage('Produto adicionado ao carrinho.')
      return
    }

    const { error: insertError } = await supabase
      .from('cart_items')
      .insert({
        user_id: session.user.id,
        product_id: productId,
        quantity: 1
      })

    setAddingToCartProductId(null)
    if (insertError) {
      setCheckoutMessage(insertError.message)
      return
    }

    window.dispatchEvent(new Event('cart-updated'))
    setCheckoutMessage('Produto adicionado ao carrinho.')
  }

  return (
      <main id="galeria" className="min-h-screen bg-dirt text-bg page-fade-in">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-16">
          <div className="relative h-[360px] sm:h-[420px] lg:h-[520px]">
            <Image
                src="/frame.png"
                alt="Galeria e Curadoria"
                fill
                className="object-cover object-right"
                priority
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="relative z-10 h-full px-6 sm:px-8 lg:px-16 flex items-end pb-10 lg:pb-14">
              <div className="grid w-full grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10">
                <div className="flex flex-col">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#b89b5e] leading-tight mb-10">
                    Galeria e
                    <br />
                    Curadoria
                  </h1>
                  <div className="mt-24 mb-8 border-l border-bg/40 pl-5 text-lg sm:text-xl font-serif text-bg/70">
                    A arte não decora.
                    <br />
                    Ela dialoga.
                  </div>
                </div>
                <div className="flex justify-end items-end pb-8">
                  <p className="text-lg text-bg/55 font-serif leading-relaxed max-w-2xl">
                    Uma seleção de peças autorais e obras de artistas independentes,
                    escolhidas com intenção para dialogar com o espaço, o tempo e a
                    identidade de quem habita.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products - WITH CAROUSEL */}
        <section className="bg-[#f5f1eb] py-16 lg:py-20 relative">
          {/* Lateral Chevrons for Products */}
          {productsCarouselEnabled && currentProductPage > 0 && (
              <button
                  onClick={prevProductPage}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-bg/95 hover:bg-bg rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Produtos anteriores"
              >
                <ChevronLeft size={24} className="text-olive group-hover:text-gold transition-colors" />
              </button>
          )}

          {productsCarouselEnabled && currentProductPage < totalProductPages - 1 && (
              <button
                  onClick={nextProductPage}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-bg/95 hover:bg-bg rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Próximos produtos"
              >
                <ChevronRight size={24} className="text-olive group-hover:text-gold transition-colors" />
              </button>
          )}

          <div className="px-6 sm:px-8">
            <p className="mb-10 mx-auto max-w-4xl text-center text-base sm:text-lg font-serif italic text-[#735746]">
              {productsPhrase}
            </p>
            {loading && <p className="text-bg/70 font-sans">Carregando...</p>}
            {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {visibleProducts.map((product) => {
                    const images = parseImages(product)
                    const hasImages = images.length > 0
                    return (
                        <div key={product.id} className="text-left">
                          <div className="border border-[#d8cdbf] p-3 md:p-4 bg-[#f5f1eb] flex flex-col w-full max-w-[286px] sm:max-w-[308px] lg:max-w-[330px] mx-auto">
                            <div className="relative aspect-[4/5] border border-[#e4dbcf] bg-[#efe9df]">
                              {hasImages && (
                                  <MiniCarousel
                                      images={images}
                                      alt={product.name}
                                      className="h-full !min-h-0 !p-0"
                                  />
                              )}
                            </div>
                            <div className="mt-3 flex items-end justify-between">
                              <p className="flex items-center font-sans leading-none">
                                <span className="mr-2 text-[13px] text-[#735746]">R$</span>
                                <span className="text-[26px] text-[#3b2f26]">{formatPriceText(product.price_text)}</span>
                              </p>
                              <p className="text-[13px] tracking-[0.08em] text-[#735746] font-thin font-sans pb-1">
                                Exclusivo
                              </p>
                            </div>
                            <div className="mt-4 flex items-center gap-4">
                              <button
                                  type="button"
                                  onClick={() => addToCart(product.id)}
                                  disabled={addingToCartProductId === product.id}
                                  className="shrink-0 text-[#735746] transition-colors hover:text-[#644435] disabled:opacity-60"
                                  aria-label="Adicionar ao carrinho"
                              >
                                <ShoppingCart size={20} className="text-[#735746]" />
                              </button>
                              <button
                                  type="button"
                                  onClick={() => checkoutProduct(product.id)}
                                  disabled={checkoutLoadingProductId === product.id}
                                  className="flex-1 bg-[#735746] hover:bg-[#644435] px-3 py-2 rounded-sm text-[#f5f1eb] transition-colors disabled:opacity-60"
                              >
                                <span className="flex items-center justify-center font-sans text-[21px] leading-none">
                                  {checkoutLoadingProductId === product.id ? '...' : 'Compre agora'}
                                </span>
                              </button>
                            </div>
                          </div>
                          <div className="mt-8 w-full max-w-[286px] sm:max-w-[308px] lg:max-w-[330px] mx-auto">
                            <h3 className="flex justify-center text-[22px] font-serif text-[#3b2f26] text-center">
                              “{product.name}”
                            </h3>
                            <div className="mt-1 flex justify-center text-[#9f8a74]">
                              <ChevronDown size={16} />
                            </div>
                          </div>
                        </div>
                    )
                  })}
                </div>
            )}

            {/* Product Page Indicators */}
            {productsCarouselEnabled && totalProductPages > 1 && (
                <div className="flex justify-center gap-3 mt-12">
                  {Array.from({ length: totalProductPages }).map((_, index) => (
                      <button
                          key={index}
                          onClick={() => setCurrentProductPage(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                              index === currentProductPage
                                  ? 'bg-gold w-12'
                                  : 'bg-bg/40 w-2 hover:bg-bg/70'
                          }`}
                          aria-label={`Ir para página ${index + 1}`}
                      />
                  ))}
                </div>
            )}
          </div>
          {checkoutMessage && (
              <p className="text-center mt-8 text-sm text-bg/80">{checkoutMessage}</p>
          )}
        </section>

        {/* Exhibitors - Chevrons only on hover, positioned at exhibitors */}
        <section className="bg-[#f5f1eb] pb-16 group/exhibitors">
          <div className="px-6 sm:px-8 lg:px-24">
            <div className="mb-12">
              <h2 className="text-[41px] font-serif text-[#b89b5e]">
                Expositores
              </h2>
              <p className="mt-3 text-[17px] font-serif text-[#735746]">
                Nossa arte tem o propósito de trazer vida para o que chamamos de lar.
              </p>
            </div>

            {/* Exhibitors with chevrons */}
            <div className="relative px-0 lg:px-40">
              {/* Chevrons - show only on section hover, positioned at exhibitors */}
              {exhibitorsCarouselEnabled && (
                  <>
                    <button
                        onClick={prevExhibitorPage}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-bg/95 hover:bg-bg rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-0 group-hover/exhibitors:opacity-100 lg:-left-14"
                        aria-label="Expositores anteriores"
                    >
                      <ChevronLeft size={22} className="text-olive" />
                    </button>
                    <button
                        onClick={nextExhibitorPage}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-bg/95 hover:bg-bg rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-0 group-hover/exhibitors:opacity-100 lg:-right-14"
                        aria-label="Próximos expositores"
                    >
                      <ChevronRight size={22} className="text-olive" />
                    </button>
                  </>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                {visibleExhibitors.map((exhibitor) => (
                    <article key={exhibitor.id} className="flex gap-4 sm:gap-6 items-start min-w-0">
                      <div className="relative w-24 h-24 sm:w-[132px] sm:h-[132px] rounded-[6px] overflow-hidden shrink-0">
                        {exhibitor.avatar_url && (
                            <Image
                                src={exhibitor.avatar_url}
                                alt={exhibitor.name}
                                fill
                                className="object-cover"
                            />
                        )}
                      </div>
                      <div className="min-w-0 pt-1">
                        <h3 className="font-serif text-[15px] text-[#3b2f26] leading-tight mb-2">
                          {exhibitor.name.split('\n').map((line, i) => (
                              <span key={i} className="block">{line}</span>
                          ))}
                        </h3>
                        <p className="text-[13px] text-[#3b2f26] font-serif font-thin leading-relaxed">
                          {(exhibitor.title || '').split('\n').map((line, i) => (
                              <span key={i} className="block">{line}</span>
                          ))}
                        </p>
                        {exhibitor.instagram_path && (
                            <p className="text-[12px] text-[#3b2f26] mt-6 font-serif font-thin inline-flex items-center gap-1">
                              <Instagram size={12} className="text-[#d5ccb9]" />
                              {exhibitor.instagram_path}
                            </p>
                        )}
                      </div>
                    </article>
                ))}
              </div>
            </div>

            {/* Dots */}
            {exhibitorsCarouselEnabled && totalExhibitorPages > 1 && (
                <div className="flex justify-center gap-3 mt-10">
                  {Array.from({ length: totalExhibitorPages }).map((_, index) => (
                      <button
                          key={index}
                          onClick={() => setCurrentExhibitorPage(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                              index === currentExhibitorPage
                                  ? 'bg-gold w-12'
                                  : 'bg-bg/40 w-2 hover:bg-bg/70'
                          }`}
                          aria-label={`Ir para página de expositores ${index + 1}`}
                      />
                  ))}
                </div>
            )}
          </div>
        </section>

        <Footer paymentInfo />
      </main>
  )
}
