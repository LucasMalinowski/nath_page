'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase, PortfolioImage } from '@/lib/supabase'
import { useSiteText } from '@/lib/siteText'
import { MiniCarousel } from './MiniCarousel'

// Extended type to support multiple images (will migrate DB later)
type PortfolioProject = PortfolioImage & {
  images?: string[] // Array of images for carousel
}

const Portfolio = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [portfolioImages, setPortfolioImages] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [itemsPerPage, setItemsPerPage] = useState(4)
  const [pauseUntil, setPauseUntil] = useState(0)
  const [isPageFading, setIsPageFading] = useState(false)
  const fadeTimeout = useRef<NodeJS.Timeout | null>(null)

  const portfolioTitle = useSiteText('portfolio_title', 'Portfólio')
  const portfolioSubtitle = useSiteText('portfolio_subtitle', 'Meus serviços acompanham diferentes momentos, sempre com um olhar autoral, sensível e estruturado.')
  const portfolioLoading = useSiteText('portfolio_loading', 'Carregando...')
  const portfolioEmpty = useSiteText('portfolio_empty', 'Em breve, novos projetos serão adicionados')
  const portfolioPrevLabel = useSiteText('portfolio_prev_label', 'Página anterior')
  const portfolioNextLabel = useSiteText('portfolio_next_label', 'Próxima página')

  useEffect(() => {
    fetchPortfolioImages()
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    return () => {
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
    }
  }, [])

  const handleResize = () => {
    if (window.innerWidth >= 1280) {
      setItemsPerPage(4)
    } else if (window.innerWidth >= 1024) {
      setItemsPerPage(3)
    } else if (window.innerWidth >= 640) {
      setItemsPerPage(2)
    } else {
      setItemsPerPage(1)
    }
  }

  const fetchPortfolioImages = async () => {
    try {
      const { data, error } = await supabase
          .from('portfolio_images')
          .select('*')
          .eq('is_visible', true)
          .order('display_order', { ascending: true })

      if (error) throw error

      // Transform data to support multiple images
      // Handle both array format and JSON string format from Supabase
      const projects: PortfolioProject[] = (data || []).map((item) => {
        let imagesArray: string[] = []

        // Check if images field exists and parse it
        if (item.images) {
          if (typeof item.images === 'string') {
            // It's a JSON string, parse it
            try {
              imagesArray = JSON.parse(item.images)
            } catch (e) {
              console.error('Error parsing images JSON:', e)
              imagesArray = [item.image_url]
            }
          } else if (Array.isArray(item.images)) {
            // Already an array
            imagesArray = item.images
          } else {
            // Fallback to single image
            imagesArray = [item.image_url]
          }
        } else {
          // No images field, use image_url
          imagesArray = [item.image_url]
        }

        return {
          ...item,
          images: imagesArray,
        }
      })

      setPortfolioImages(projects)
    } catch (error) {
      console.error('Error fetching portfolio images:', error)
    } finally {
      setLoading(false)
    }
  }

  const pauseAuto = () => {
    setPauseUntil(Date.now() + 20000)
  }

  const setPageWithFade = (nextIndex: number) => {
    if (nextIndex === currentIndex) return
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
    setIsPageFading(true)
    fadeTimeout.current = setTimeout(() => {
      setCurrentIndex(nextIndex)
      requestAnimationFrame(() => setIsPageFading(false))
    }, 200)
  }

  const advancePage = () => {
    if (totalPages <= 1) return
    const nextIndex = currentIndex === totalPages - 1 ? 0 : currentIndex + 1
    setPageWithFade(nextIndex)
  }

  const totalPages = Math.ceil(portfolioImages.length / itemsPerPage)
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < totalPages - 1

  const nextSlide = () => {
    pauseAuto()
    if (canGoNext) {
      setPageWithFade(currentIndex + 1)
    }
  }

  const prevSlide = () => {
    pauseAuto()
    if (canGoPrev) {
      setPageWithFade(currentIndex - 1)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() < pauseUntil) return
      advancePage()
    }, 6000)

    return () => clearInterval(interval)
  }, [pauseUntil, totalPages, currentIndex])

  const getCurrentItems = () => {
    const start = currentIndex * itemsPerPage
    const end = start + itemsPerPage
    return portfolioImages.slice(start, end)
  }

  if (loading) {
    return (
        <section id="portfolio" className="relative py-16 texture-green">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
            <div className="mb-16">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-gold mb-4">
                {portfolioTitle}
              </h2>
            </div>
            <div className="flex items-center justify-center h-96">
              <p className="text-bg/70 font-sans text-lg">{portfolioLoading}</p>
            </div>
          </div>
        </section>
    )
  }

  if (portfolioImages.length === 0) {
    return (
        <section id="portfolio" className="relative py-16 texture-green">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
            <div className="mb-16">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-gold mb-4">
                {portfolioTitle}
              </h2>
            </div>
            <div className="text-center py-20">
              <p className="text-bg/70 text-xl mb-8 font-sans">
                {portfolioEmpty}
              </p>
            </div>
          </div>
        </section>
    )
  }

  const currentItems = getCurrentItems()

  return (
      <section id="portfolio" className="relative py-16 texture-green overflow-hidden">
        <div className="px-20">
          {/* Section Header - Same as Concept */}
          <div className="container flex flex-col min-h-[200px] ">
            <div className="self-start">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-gold leading-tight">
                {portfolioTitle}
              </h2>
            </div>

            {/* Subtítulo no bottom direito */}
            <div className="self-end max-w-md mt-8 lg:mt-0">
              <p className="border-l pl-4 text-lg md:text-xl font-sans font-thin text-bg/60 italic leading-relaxed">
                {portfolioSubtitle}
              </p>
            </div>
          </div>

          {/* Container for cards and navigation - FIXED POSITIONING */}
          <div className="relative">
            {/* Lateral Navigation Buttons - Positioned relative to card grid */}
            {canGoPrev && (
                <button
                    onClick={prevSlide}
                    className="absolute -left-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-bg/95 hover:bg-bg rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    aria-label={portfolioPrevLabel}
                >
                  <ChevronLeft
                      size={24}
                      className="text-olive group-hover:text-gold transition-colors"
                  />
                </button>
            )}

            {canGoNext && (
                <button
                    onClick={nextSlide}
                    className="absolute -right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-bg/95 hover:bg-bg rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    aria-label={portfolioNextLabel}
                >
                  <ChevronRight
                      size={24}
                      className="text-olive group-hover:text-gold transition-colors"
                  />
                </button>
            )}

            {/* Grid of Cards - COMPACT like image 2 */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 transition-opacity duration-300 ${isPageFading ? 'opacity-0' : 'opacity-100'}`}>
              {currentItems.map((project) => (
                  <article
                      key={project.id}
                      className="group relative"
                  >
                    {/* Card Container - COMPACT */}
                    <div className="relative bg-olive border-2 border-bg/40 min-h-[500px] rounded-sm overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-gold hover:shadow-2xl">
                      {/* Text Content at Top - COMPACT */}
                      <div className="p-4">
                        <h3 className="text-2xl font-serif font-normal text-bg mb-2 leading-tight line-clamp-2">
                          {project.title}
                        </h3>
                        {project.description && (
                            <p className="font-sans font-thin text-bg/70 leading-relaxed line-clamp-2">
                              {project.description}
                            </p>
                        )}
                      </div>

                      {/* Mini Carousel - Takes most of card space */}
                      <MiniCarousel
                          images={project.images || [project.image_url]}
                          alt={project.title}
                          pauseUntil={pauseUntil}
                          onUserNavigate={pauseAuto}
                      />
                    </div>
                  </article>
              ))}
            </div>
          </div>

          {/* Page Indicator */}
          {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-12">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? 'bg-gold w-12'
                                : 'bg-bg/40 w-2 hover:bg-bg/70'
                        }`}
                        aria-label={`Ir para página ${index + 1}`}
                    />
                ))}
              </div>
          )}
        </div>
      </section>
  )
}

export default Portfolio
