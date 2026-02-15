'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Instagram, ShoppingCart } from 'lucide-react'
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

export default function GaleriaPage() {
  const router = useRouter()
  const [products, setProducts] = useState<GalleryProduct[]>([])
  const [exhibitors, setExhibitors] = useState<GalleryExhibitor[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoadingProductId, setCheckoutLoadingProductId] = useState<string | null>(null)
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null)
  const [currentExhibitorPage, setCurrentExhibitorPage] = useState(0)
  const [currentProductPage, setCurrentProductPage] = useState(0)
  const [exhibitorsPerPage, setExhibitorsPerPage] = useState(2)
  const productsPerPage = 3 // 2 rows of 3

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

  return (
      <main className="min-h-screen bg-dirt text-bg page-fade-in">
        <Navbar />

        {/* Hero */}
        <section className="relative mt-16">
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
        <section className="texture-brown py-16 lg:py-20 relative">
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

          <div className="px-8">
            {loading && <p className="text-bg/70 font-sans">Carregando...</p>}
            {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {visibleProducts.map((product) => {
                    const images = parseImages(product)
                    const hasImages = images.length > 0
                    return (
                        <div key={product.id} className="text-left">
                          <div className="border border-[#B89B5E] p-3 md:p-4 bg-[#4B4038]/40 flex flex-col w-full max-w-[286px] sm:max-w-[308px] lg:max-w-[330px] mx-auto">
                            <div className="relative aspect-[3/4] border border-bg/30 bg-bg/5">
                              {hasImages && (
                                  <MiniCarousel
                                      images={images}
                                      alt={product.name}
                                      className="h-full !min-h-0 !p-0"
                                  />
                              )}
                            </div>
                            {product.author && (
                                <p className="mt-2 text-xs italic text-bg/70 font-sans text-right">
                                  {product.author}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={() => checkoutProduct(product.id)}
                                disabled={checkoutLoadingProductId === product.id}
                                className="mt-3 w-full flex items-center justify-between bg-[#3b2f26] hover:bg-[#48372c] px-3 py-2 rounded-sm text-bg/90 transition-colors disabled:opacity-60"
                            >
                              <span className="inline-flex items-center gap-2 font-sans text-sm">
                                <ShoppingCart size={20} />
                                {checkoutLoadingProductId === product.id ? '...' : 'Comprar'}
                              </span>
                              <span className="font-sans tracking-wide text-lg">
                          {product.price_text ? `R$ ${product.price_text}` : 'R$ 0,00'}
                        </span>
                            </button>
                          </div>
                          <div className="mt-4 w-full max-w-[286px] sm:max-w-[308px] lg:max-w-[330px] mx-auto">
                            <h3 className="flex justify-center text-2xl font-serif text-bg/80 text-left">
                              "{product.name}"
                            </h3>
                            <br />
                            <p className="text-[0.80rem] text-bg/75 font-sans mt-2 leading-relaxed text-center italic">
                              {product.description}
                            </p>
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
        <section className="texture-green py-16 group/exhibitors">
          <div className="px-24">
            <div className="mb-12">
              <h2 className="text-6xl font-serif text-gold/80">
                Expositores
              </h2>
            </div>

            <div className="flex gap-32 items-start justify-between">
              {/* Quote on left */}
              <div className="flex-shrink-0 w-80 border-l-2 border-bg/40 pl-6 text-base text-bg/65 font-serif">
                "Nossa arte tem o propósito de trazer vida para o que chamamos de lar..."
              </div>

              {/* Exhibitors with chevrons */}
              <div className="relative flex-1">
                {/* Chevrons - show only on section hover, positioned at exhibitors */}
                {exhibitorsCarouselEnabled && (
                    <>
                      <button
                          onClick={prevExhibitorPage}
                          className="absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-bg/95 hover:bg-bg rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-0 group-hover/exhibitors:opacity-100"
                          aria-label="Expositores anteriores"
                      >
                        <ChevronLeft size={22} className="text-olive" />
                      </button>
                      <button
                          onClick={nextExhibitorPage}
                          className="absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-bg/95 hover:bg-bg rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-0 group-hover/exhibitors:opacity-100"
                          aria-label="Próximos expositores"
                      >
                        <ChevronRight size={22} className="text-olive" />
                      </button>
                    </>
                )}

                <div className="flex gap-8 flex-1">
                  {visibleExhibitors.map((exhibitor) => (
                      <article key={exhibitor.id} className="flex gap-4 items-start flex-1 min-w-0">
                        <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
                          {exhibitor.avatar_url && (
                              <Image
                                  src={exhibitor.avatar_url}
                                  alt={exhibitor.name}
                                  fill
                                  className="object-cover"
                              />
                          )}
                        </div>
                        <div className="text-bg/90 min-w-0">
                          <h3 className="font-serif text-xl leading-tight mb-2">
                            {exhibitor.name.split('\n').map((line, i) => (
                                <span key={i} className="block">{line}</span>
                            ))}
                          </h3>
                          <p className="text-sm text-bg/75 font-sans leading-relaxed">
                            {(exhibitor.title || '').split('\n').map((line, i) => (
                                <span key={i} className="block">{line}</span>
                            ))}
                          </p>
                          {exhibitor.instagram_path && (
                              <p className="text-xs text-bg/70 mt-2 font-sans inline-flex items-center gap-1">
                                <Instagram size={14} />
                                {exhibitor.instagram_path.startsWith('@') ? exhibitor.instagram_path : `@${exhibitor.instagram_path}`}
                              </p>
                          )}
                        </div>
                      </article>
                  ))}
                </div>
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

        <Footer contactInfo={false} />
      </main>
  )
}
