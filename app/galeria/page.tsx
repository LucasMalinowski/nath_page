'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Instagram, ShoppingCart, SquareArrowUpRight, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import { supabase, GalleryProduct, GalleryExhibitor } from '@/lib/supabase'
import { MiniCarousel } from '@/components/MiniCarousel'
import { captureBrowserEvent } from '@/lib/posthog-browser'
import { breadcrumbJsonLd, siteUrl } from '@/lib/seo'

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

const formatPackageMetric = (value?: number | null): string | null => {
  if (value === null || value === undefined || Number.isNaN(value)) return null
  return Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 2 })
}

const galleryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${siteUrl}/galeria#collection`,
  name: 'Galeria de Artes e Curadoria',
  url: `${siteUrl}/galeria`,
  inLanguage: 'pt-BR',
  description:
    'Galeria de artes, obras autorais e curadoria de pecas selecionadas por Nathalia Malinowski para interiores com identidade.',
  isPartOf: {
    '@id': `${siteUrl}/#website`
  }
}

const commissionTypes = [
  { title: 'Telas personalizadas', sub: 'Dimensão, paleta e tema escolhidos por você' },
  { title: 'Bastidores sob medida', sub: 'Para nichos, cabeceiras, áreas de destaque' },
  { title: 'Composição por ambiente', sub: 'Coleção de múltiplas peças para um espaço' },
]

const commissionsWhatsappHref =
  'https://wa.me/5545998028130?text=Ola%20Nathalia%2C%20tenho%20interesse%20em%20uma%20encomenda%20personalizada!'

const revealClasses =
  'opacity-0 translate-y-3 transition-[opacity,transform] duration-[900ms] ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0'

export default function GaleriaPage() {
  const router = useRouter()
  const revealRootRef = useRef<HTMLElement | null>(null)
  const [products, setProducts] = useState<GalleryProduct[]>([])
  const [exhibitors, setExhibitors] = useState<GalleryExhibitor[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCartProductId, setAddingToCartProductId] = useState<string | null>(null)
  const [checkoutLoadingProductId, setCheckoutLoadingProductId] = useState<string | null>(null)
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<GalleryProduct | null>(null)

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
          .eq('exhibitor_member', true)
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
    if (!selectedProduct) return

    captureBrowserEvent('product_viewed', {
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      product_author: selectedProduct.author,
      product_price_text: selectedProduct.price_text
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProduct(null)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedProduct])

  useEffect(() => {
    const root = revealRootRef.current
    if (!root || loading) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px'
      }
    )

    targets.forEach((target) => observer.observe(target))

    return () => observer.disconnect()
  }, [loading, products.length, exhibitors.length])

  const checkoutProduct = async (productId: string) => {
    const product = products.find((item) => item.id === productId)
    captureBrowserEvent('buy_now_clicked', {
      product_id: productId,
      product_name: product?.name || null,
      product_price_text: product?.price_text || null
    })
    setCheckoutLoadingProductId(productId)
    await addToCart(productId, {
      successMessage: 'Produto adicionado. Escolha o frete no carrinho para finalizar a compra.',
      skipLoadingState: true
    })
    setCheckoutLoadingProductId(null)
    router.push('/carrinho')
  }

  const addToCart = async (
    productId: string,
    options?: { successMessage?: string; skipLoadingState?: boolean }
  ) => {
    const product = products.find((item) => item.id === productId)
    captureBrowserEvent('add_to_cart_clicked', {
      product_id: productId,
      product_name: product?.name || null,
      product_price_text: product?.price_text || null
    })

    if (!options?.skipLoadingState) {
      setAddingToCartProductId(productId)
    }
    setCheckoutMessage(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      captureBrowserEvent('add_to_cart_failed', {
        product_id: productId,
        reason: 'auth_required'
      })
      if (!options?.skipLoadingState) {
        setAddingToCartProductId(null)
      }
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
      captureBrowserEvent('add_to_cart_failed', {
        product_id: productId,
        reason: 'existing_item_lookup_failed',
        error_message: existingItemError.message
      })
      if (!options?.skipLoadingState) {
        setAddingToCartProductId(null)
      }
      setCheckoutMessage(existingItemError.message)
      return
    }

    if (existingItem?.id) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id)

      if (!options?.skipLoadingState) {
        setAddingToCartProductId(null)
      }
      if (updateError) {
        captureBrowserEvent('add_to_cart_failed', {
          product_id: productId,
          reason: 'cart_update_failed',
          error_message: updateError.message
        })
        setCheckoutMessage(updateError.message)
        return
      }

      window.dispatchEvent(new Event('cart-updated'))
      captureBrowserEvent('cart_item_added', {
        product_id: productId,
        product_name: product?.name || null,
        quantity: existingItem.quantity + 1,
        action: 'increment'
      })
      setCheckoutMessage(options?.successMessage || 'Produto adicionado ao carrinho.')
      return
    }

    const { error: insertError } = await supabase
      .from('cart_items')
      .insert({
        user_id: session.user.id,
        product_id: productId,
        quantity: 1
      })

    if (!options?.skipLoadingState) {
      setAddingToCartProductId(null)
    }
    if (insertError) {
      captureBrowserEvent('add_to_cart_failed', {
        product_id: productId,
        reason: 'cart_insert_failed',
        error_message: insertError.message
      })
      setCheckoutMessage(insertError.message)
      return
    }

    window.dispatchEvent(new Event('cart-updated'))
    captureBrowserEvent('cart_item_added', {
      product_id: productId,
      product_name: product?.name || null,
      quantity: 1,
      action: 'insert'
    })
    setCheckoutMessage(options?.successMessage || 'Produto adicionado ao carrinho.')
  }

  const selectedProductAllImages = selectedProduct ? parseImages(selectedProduct) : []
  // The first image is a transparent-background cutout meant only for the gallery grid —
  // skip it here unless it's the only photo the product has.
  const selectedProductImages =
    selectedProductAllImages.length > 1 ? selectedProductAllImages.slice(1) : selectedProductAllImages

  return (
    <>
      <main ref={revealRootRef} id="galeria" className="min-h-screen bg-[#ede8df] text-[#3b2f26] page-fade-in">
        <JsonLd
          data={[
            galleryJsonLd,
            breadcrumbJsonLd([
              { name: 'Inicio', url: `${siteUrl}/` },
              { name: 'Galeria', url: `${siteUrl}/galeria` }
            ])
          ]}
        />
        <Navbar />

        {/* Hero */}
        <section className="relative flex min-h-[92vh] flex-col justify-end bg-[url('/frame.png')] bg-cover bg-[center_30%] sm:min-h-screen">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(12,8,4,.7) 0%, rgba(12,8,4,.38) 35%, rgba(12,8,4,.82) 70%, rgba(12,8,4,.97) 100%)'
            }}
          />
          <div className="relative z-10 px-6 pb-16 pt-24 sm:px-8 lg:px-16 lg:pb-20">
            <div className="mb-5 flex items-center gap-3.5">
              <span className="h-px w-[30px] bg-[#B89B5E]/55" />
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B89B5E]">
                Galeria & Curadoria
              </p>
            </div>
            <h1 className="mb-6 font-poetic text-[44px] font-light italic leading-[1.08] text-[#e8d9b8] sm:text-[64px] lg:text-[96px]">
              Uma exposição
              <br />
              em aberto.
            </h1>
            <div className="mb-5 h-px w-[50px] bg-[#B89B5E]/40" />
            <p className="max-w-[420px] font-poetic text-[15px] font-light italic leading-[1.65] text-[#F5F1EB]/50 sm:text-[18px]">
              Peças autorais escolhidas com intenção,<br />
              para dialogar com o espaço e a identidade de quem habita.
            </p>
          </div>
          <div className="absolute bottom-7 right-6 z-10 flex flex-col items-center gap-2 sm:right-8 lg:right-16">
            <span className="h-9 w-px bg-gradient-to-b from-[#B89B5E]/45 to-transparent" />
            <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-[#B89B5E]/45">Explorar</span>
          </div>
        </section>

        {/* Obras em Exposição */}
        <section className="bg-[#ede8df] px-6 pt-16 sm:px-8 sm:pt-20 lg:px-16 lg:pt-24" id="obras">
          <div className="mx-auto mb-12 flex max-w-[1100px] flex-wrap items-end justify-between gap-6 sm:mb-16">
            <div className="max-w-[520px]">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B89B5E]">
                Coleção atual
              </p>
              <h2 className="mt-3 font-serif text-[26px] leading-[1.15] text-[#3b2f26] sm:text-[32px] lg:text-[40px]">
                Obras em Exposição
              </h2>
            </div>
            <p className="max-w-[380px] font-poetic text-[14px] font-light italic leading-[1.7] text-[#8a7560] sm:text-right sm:text-[16px]">
              Cada peça é exclusiva, <br />adquirida, sai da coleção.
            </p>
          </div>

          {loading && (
            <p className="mx-auto max-w-[1100px] pb-16 font-sans text-[#8a7560]">Carregando...</p>
          )}

          {!loading && products.map((product, index) => {
            const images = parseImages(product)
            const hasImages = images.length > 0
            const blankSide = product.image_blank_side === 'left' ? 'left' : 'right'

            const info = (
              <>
                <p className="mb-5 flex items-center gap-3 font-poetic text-[12px] tracking-[0.28em] text-[#B89B5E]">
                  {String(index + 1).padStart(2, '0')}
                  <span className="h-px max-w-9 flex-1 bg-[#B89B5E]/25" />
                </p>

                <div className="mb-2 flex items-start gap-3">
                  <h3 className="line-clamp-2 font-serif text-[20px] leading-tight text-[#3b2f26] sm:text-[24px] lg:text-[28px]">
                    {product.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="mt-1 shrink-0 text-[#8a7560] transition-colors hover:text-[#3b2f26]"
                    aria-label={`Abrir detalhes de ${product.name}`}
                  >
                    <SquareArrowUpRight size={18} />
                  </button>
                </div>

                {product.author && (
                  <p className="mb-3 font-poetic text-[17px] font-light italic text-[#8a7560]">por {product.author}</p>
                )}

                {product.description && (
                  <p className="mb-8 line-clamp-4 border-l-2 border-[#B89B5E]/25 pl-3.5 font-poetic text-[15px] font-light italic leading-[1.7] text-[#8a7560]">
                    {product.description}
                  </p>
                )}

                <div className="mb-5 flex flex-wrap items-center gap-4">
                  <p className="font-serif text-[22px] text-[#3b2f26]">
                    <sub className="mr-1 font-sans text-[13px] font-light text-[#8a7560]">R$</sub>
                    {formatPriceText(product.price_text)}
                  </p>
                  <span className="rounded-sm border border-[#B89B5E]/30 px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.22em] text-[#B89B5E]">
                    Exclusivo
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => checkoutProduct(product.id)}
                    disabled={checkoutLoadingProductId === product.id}
                    className="rounded-sm bg-[#3b2f26] px-7 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.13em] text-[#f5f1eb] transition-colors hover:bg-[#5a3c28] disabled:opacity-60"
                  >
                    {checkoutLoadingProductId === product.id ? '...' : 'Compre agora'}
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(product.id)}
                    disabled={addingToCartProductId === product.id}
                    className="flex items-center gap-2 rounded-sm border border-[#3b2f26]/20 px-5 py-[11px] font-sans text-[11px] text-[#8a7560] transition-colors hover:border-[#3b2f26] hover:text-[#3b2f26] disabled:opacity-60"
                  >
                    <ShoppingCart size={15} />
                    Adicionar ao carrinho
                  </button>
                </div>
              </>
            )

            return (
              <article
                key={product.id}
                data-reveal
                className={`mx-auto grid max-w-[1100px] grid-cols-1 gap-x-10 border-t border-[#3b2f26]/10 last:border-b lg:grid-cols-2 lg:gap-x-16 ${revealClasses}`}
              >
                {/* The first image is a product cutout with a transparent background — it floats
                    on the section's flat color, so object-contain keeps it fully visible at any size. */}
                <div
                  className={`relative min-h-[320px] sm:min-h-[400px] lg:min-h-[520px] ${
                    blankSide === 'right' ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  {hasImages && (
                    <Image
                      src={images[0]}
                      alt={product.name}
                      fill
                      className="object-contain py-10 sm:py-12 lg:py-16"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  )}
                </div>

                <div
                  className={`flex flex-col justify-center py-10 sm:py-12 ${
                    blankSide === 'right' ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  {info}
                </div>
              </article>
            )
          })}

          {checkoutMessage && (
            <p className="px-6 py-8 text-center font-sans text-sm text-[#8a7560]">{checkoutMessage}</p>
          )}
        </section>

        {/* Encomendas */}
        <section className="texture-brown relative bg-[#160f08] bg-cover bg-center px-6 py-20 sm:px-8 sm:py-24 lg:px-16" id="encomendas">
          <div className="absolute inset-0 bg-[#0c0804]/78" />
          <div className="relative z-10 mx-auto max-w-[1100px]">
            <div className="mb-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-[72px]">
              <div data-reveal className={revealClasses}>
                <p className="mb-5 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B89B5E]">
                  Encomendas personalizadas
                </p>
                <h2 className="mb-6 font-poetic text-[36px] font-light italic leading-[1.05] text-[#e8d9b8] sm:text-[48px] lg:text-[60px]">
                  Sua visão,
                  <br />
                  nossa tela.
                </h2>
                <div className="mb-5 h-px w-10 bg-[#B89B5E]/40" />
                <p className="font-poetic text-[17px] font-light italic leading-[1.72] text-[#F5F1EB]/55 sm:text-[18px]">
                  Cada ambiente tem uma história para contar. Criamos telas e bastidores sob medida, pensados junto com você, para o espaço que você habita.
                </p>
              </div>

              <div data-reveal className={`pt-1.5 ${revealClasses}`}>
                {commissionTypes.map((item, i) => (
                  <div
                    key={item.title}
                    className={`flex items-start gap-4 border-t border-[#B89B5E]/15 py-5 sm:gap-5 ${i === commissionTypes.length - 1 ? 'border-b' : ''}`}
                  >
                    <span className="min-w-[26px] pt-0.5 font-poetic text-[13px] font-light tracking-[0.1em] text-[#B89B5E]/45">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="mb-1 font-serif text-[16px] text-[#F5F1EB]/90">{item.title}</p>
                      <p className="font-poetic text-[14px] italic leading-[1.5] text-[#F5F1EB]/40">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal className={`flex flex-wrap items-center gap-10 border-t border-[#B89B5E]/15 pt-10 ${revealClasses}`}>
              <p className="min-w-[200px] flex-1 font-poetic text-[16px] italic leading-[1.6] text-[#F5F1EB]/40">
                Cada encomenda começa com uma conversa. Conta pra gente o que você imagina.
              </p>
              <a
                href={commissionsWhatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 whitespace-nowrap rounded-sm bg-[#B89B5E] px-9 py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1a0e04] transition-all hover:-translate-y-0.5 hover:bg-[#cdb278] hover:shadow-[0_14px_36px_rgba(184,155,94,0.22)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.97L0 24l6.22-1.57A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 22c-1.85 0-3.66-.5-5.24-1.44l-.38-.22-3.93.99 1.03-3.81-.24-.39A9.95 9.95 0 0 1 2 12C2 6.49 6.49 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.95 9.95 0 0 1 22 12c0 5.51-4.49 10-10 10Zm5.47-7.34c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.47-2.4-1.49-.89-.8-1.49-1.78-1.66-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.06 2.89 1.21 3.09c.15.2 2.09 3.19 5.07 4.48.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.11.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34Z" />
                </svg>
                Encomendar via WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Expositores */}
        <section className="bg-[#f5f1eb] px-6 py-20 sm:px-8 sm:py-24 lg:px-16" id="expositores">
          <div data-reveal className={`mb-12 sm:mb-14 ${revealClasses}`}>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B89B5E]">Nossa rede</p>
            <h2 className="mt-3 font-serif text-[28px] text-[#b89b5e] sm:text-[32px] lg:text-[36px]">Expositores</h2>
            <p className="mt-2 font-poetic text-[15px] italic text-[#8a7560] sm:text-[16px]">
              Nossa arte tem o propósito de trazer vida para o que chamamos de lar.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-12 gap-y-10">
            {exhibitors.map((exhibitor) => {
              const instagramHandle = exhibitor.instagram_path
                ? exhibitor.instagram_path.replace(/^@/, '').toLowerCase()
                : null
              const instagramHref = instagramHandle
                ? `https://instagram.com/${instagramHandle}`
                : null

              return (
                <article
                  key={exhibitor.id}
                  data-reveal
                  className={`flex items-start gap-5 ${revealClasses}`}
                >
                  <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[5px] bg-[#ede8df] sm:h-[100px] sm:w-[100px]">
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
                    <h3 className="mb-1.5 font-serif text-[16px] leading-tight text-[#3b2f26] sm:text-[17px]">
                      {exhibitor.name.split('\n').map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </h3>
                    <p className="font-poetic text-[13px] font-light italic leading-[1.55] text-[#8a7560] sm:text-[14px]">
                      {(exhibitor.title || '').split('\n').map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                    {instagramHref && (
                      <a
                        href={instagramHref}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] text-[#B89B5E]/75 transition-colors hover:text-[#B89B5E]"
                      >
                        <Instagram size={11} />
                        {instagramHandle}
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <Footer paymentInfo />
      </main>
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-[#2a1f18]/70 px-4 py-6 flex items-start justify-center"
          onClick={() => setSelectedProduct(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-sm bg-[#f5f1eb] text-[#3b2f26] shadow-2xl my-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-[#f5f1eb]/90 p-2 text-[#3b2f26] transition-colors hover:text-[#735746]"
              aria-label="Fechar modal"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              {/* Image constrained on mobile so content below is reachable without endless scroll */}
              <div className="relative h-[260px] sm:h-[320px] md:h-auto md:aspect-[4/5] bg-[#ebe4d9]">
                {selectedProductImages.length > 0 ? (
                  <MiniCarousel
                    images={selectedProductImages}
                    alt={selectedProduct.name}
                    className="h-full !min-h-0 !p-0"
                  />
                ) : (
                  <div className="h-full w-full bg-[#ebe4d9]" />
                )}
              </div>

              <div className="flex min-h-full flex-col px-6 py-8 sm:px-8 md:px-10">
                <p className="text-[12px] uppercase tracking-[0.22em] text-[#9f8a74]">Produto</p>
                <h2 id="product-modal-title" className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
                  {selectedProduct.name}
                </h2>
                <p className="mt-4 text-[13px] uppercase tracking-[0.18em] text-[#8c755f]">
                  {selectedProduct.author?.trim() ? `Por ${selectedProduct.author}` : 'Autor não informado'}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-[#5e493a] sm:text-[15px]">
                  {selectedProduct.description?.trim() || 'Descrição indisponível no momento.'}
                </p>

                <div className="mt-auto pt-8">
                  <div className="w-full max-w-[14.5rem] rounded-[16px] border border-[#ddd3c6] bg-[#f8f4ed] px-4 py-3 md:w-[38%] md:min-w-[13rem]">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#ab9884]">Dimensões do item</p>
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#b29f8c]">Peso</p>
                        <p className="text-[13px] text-[#6d5847]">{selectedProduct.package_weight_grams ? `${selectedProduct.package_weight_grams} g` : 'Não informado'}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#b29f8c]">Altura</p>
                        <p className="text-[13px] text-[#6d5847]">{formatPackageMetric(selectedProduct.package_height_cm) ? `${formatPackageMetric(selectedProduct.package_height_cm)} cm` : 'Não informado'}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#b29f8c]">Largura</p>
                        <p className="text-[13px] text-[#6d5847]">{formatPackageMetric(selectedProduct.package_width_cm) ? `${formatPackageMetric(selectedProduct.package_width_cm)} cm` : 'Não informado'}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#b29f8c]">Comprimento</p>
                        <p className="text-[13px] text-[#6d5847]">{formatPackageMetric(selectedProduct.package_length_cm) ? `${formatPackageMetric(selectedProduct.package_length_cm)} cm` : 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
