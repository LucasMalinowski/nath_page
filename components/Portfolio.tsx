'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase, PortfolioImage } from '@/lib/supabase'

const Portfolio = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolioImages()
  }, [])

  const fetchPortfolioImages = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true })

      if (error) throw error

      setPortfolioImages(data || [])
    } catch (error) {
      console.error('Error fetching portfolio images:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === portfolioImages.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? portfolioImages.length - 1 : prevIndex - 1
    )
  }

  if (loading) {
    return (
      <section id="portfolio" className="relative py-section md:py-12 lg:py-16 bg-off-white paper-texture">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-h2-mobile md:text-h2 font-serif font-semibold text-graphite mb-4">
              Portfólio
            </h2>
            <p className="text-body-mobile md:text-body font-sans text-graphite/80">
              Projetos que equilibram estética, história e vida real.
            </p>
          </div>
          <div className="flex items-center justify-center h-96">
            <p className="text-graphite/60 font-sans">Carregando...</p>
          </div>
        </div>
      </section>
    )
  }

  if (portfolioImages.length === 0) {
    return (
      <section id="portfolio" className="relative py-section md:py-24 lg:py-32 bg-off-white paper-texture">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-h2-mobile md:text-h2 font-serif font-semibold text-graphite mb-4">
              Portfólio
            </h2>
            <p className="text-body-mobile md:text-body font-sans text-graphite/80 mb-12">
              Projetos que equilibram estética, história e vida real.
            </p>
          </div>

          <div className="text-center py-20">
            <p className="text-graphite/60 text-lg mb-8 font-sans">
              Em breve, novos projetos serão adicionados
            </p>
            <a
              href="https://www.instagram.com/nathalia_malinowski/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-olive-green text-off-white font-sans font-medium rounded-button text-base tracking-wide hover:bg-soft-terracotta transition-all duration-300"
            >
              Ver todos os projetos
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="relative py-section md:py-24 lg:py-32 bg-off-white paper-texture">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-h2-mobile md:text-h2 font-serif font-semibold text-graphite mb-4">
            Portfólio
          </h2>
          <p className="text-body-mobile md:text-body font-sans text-graphite/80">
            Projetos que equilibram estética, história e vida real.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Image Display */}
          <div className="relative aspect-[16/10] bg-warm-beige rounded-lg overflow-hidden shadow-xl">
            <Image
              src={portfolioImages[currentIndex].image_url}
              alt={portfolioImages[currentIndex].title}
              fill
              className="object-contain"
              quality={100}
              unoptimized={true}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />

            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-off-white/90 hover:bg-off-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              aria-label="Imagem anterior"
            >
              <ChevronLeft
                size={28}
                className="text-graphite group-hover:text-olive-green transition-colors"
              />
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-off-white/90 hover:bg-off-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              aria-label="Próxima imagem"
            >
              <ChevronRight
                size={28}
                className="text-graphite group-hover:text-olive-green transition-colors"
              />
            </button>
          </div>

          {/* Image Title and Description */}
          <div className="mt-8 text-center">
            <h3 className="text-2xl md:text-3xl font-serif font-medium text-graphite mb-3">
              {portfolioImages[currentIndex].title}
            </h3>
            {portfolioImages[currentIndex].description && (
              <p className="text-body-mobile md:text-body font-sans text-graphite/80 max-w-2xl mx-auto">
                {portfolioImages[currentIndex].description}
              </p>
            )}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {portfolioImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-olive-green w-8'
                    : 'bg-graphite/30 w-2 hover:bg-graphite/50'
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>

          {/* Image Counter */}
          <div className="text-center mt-4">
            <p className="text-sm font-sans text-graphite/60">
              {currentIndex + 1} / {portfolioImages.length}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://www.instagram.com/nathalia_malinowski/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-transparent border-2 border-olive-green text-olive-green font-sans font-medium rounded-button text-base tracking-wide hover:bg-olive-green hover:text-off-white transition-all duration-300"
          >
            Ver todos os projetos
          </a>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
