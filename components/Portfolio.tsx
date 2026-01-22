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
        <section id="portfolio" className="relative py-20 md:py-32 bg-beige-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16">
              <h2
                  className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-800 mb-6"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
              >
                Portfólio
              </h2>
            </div>
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-600">Carregando...</p>
            </div>
          </div>
        </section>
    )
  }

  if (portfolioImages.length === 0) {
    return (
        <section id="portfolio" className="relative py-20 md:py-32 bg-beige-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16">
              <h2
                  className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-800 mb-6"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
              >
                Portfólio
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Conheça alguns dos meus projetos e trabalhos realizados
              </p>
            </div>

            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-8">
                Em breve, novos projetos serão adicionados
              </p>
              <a
                  href="https://www.instagram.com/nathalia_malinowski/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Veja mais no Instagram
              </a>
            </div>
          </div>
        </section>
    )
  }

  return (
      <section id="portfolio" className="relative md:py-8 bg-beige-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2
                className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-800 mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
            >
              Portfólio
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça alguns dos meus projetos e trabalhos realizados
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-5xl mx-auto">
            {/* Main Image Display */}
            <div className="relative aspect-[16/10] bg-beige-50 rounded-lg overflow-hidden shadow-xl">
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

              <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Imagem anterior"
              >
                <ChevronLeft
                    size={28}
                    className="text-gray-700 group-hover:text-coral-600 transition-colors"
                />
              </button>

              <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Próxima imagem"
              >
                <ChevronRight
                    size={28}
                    className="text-gray-700 group-hover:text-coral-600 transition-colors"
                />
              </button>
            </div>

            {/* Image Title and Description */}
            <div className="mt-6 text-center">
              <h3
                  className="text-2xl md:text-3xl font-light text-gray-800 mb-2"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {portfolioImages[currentIndex].title}
              </h3>
              {portfolioImages[currentIndex].description && (
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {portfolioImages[currentIndex].description}
                  </p>
              )}
            </div>

            {/* Navigation Buttons */}

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {portfolioImages.map((_, index) => (
                  <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex
                              ? 'bg-coral-600 w-8'
                              : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Ir para imagem ${index + 1}`}
                  />
              ))}
            </div>

            {/* Image Counter */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                {currentIndex + 1} / {portfolioImages.length}
              </p>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Portfolio