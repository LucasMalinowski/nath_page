'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Portfolio = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Portfolio images - Add your portfolio images here
  const portfolioImages = [
    {
      src: '/portfolio/project-1.jpg',
      alt: 'Projeto 1',
      title: 'Projeto Residencial 1',
    },
    {
      src: '/portfolio/project-2.jpg',
      alt: 'Projeto 2',
      title: 'Projeto Residencial 2',
    },
    {
      src: '/portfolio/project-3.jpg',
      alt: 'Projeto 3',
      title: 'Projeto Comercial 1',
    },
    {
      src: '/portfolio/project-4.jpg',
      alt: 'Projeto 4',
      title: 'Mural Artístico 1',
    },
    {
      src: '/portfolio/project-5.jpg',
      alt: 'Projeto 5',
      title: 'Consultoria de Ambientes',
    },
  ]

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

  return (
    <section id="portfolio" className="relative py-20 md:py-32 bg-beige-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
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

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Image Display */}
          <div className="relative aspect-[16/10] bg-gray-200 rounded-lg overflow-hidden shadow-2xl">
            {/* Placeholder for portfolio images */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-beige-200 to-beige-300">
              <div className="text-center p-8">
                <p className="text-2xl md:text-3xl font-light text-gray-600 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {portfolioImages[currentIndex].title}
                </p>
                <p className="text-gray-500 text-sm">
                  Adicione suas imagens de portfólio na pasta /public/portfolio/
                </p>
              </div>
            </div>
            
            {/* Uncomment when you add real images */}
            {/* <Image
              src={portfolioImages[currentIndex].src}
              alt={portfolioImages[currentIndex].alt}
              fill
              className="object-cover"
              priority
            /> */}
          </div>

          {/* Navigation Buttons */}
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

        {/* Instagram Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Veja mais projetos no meu Instagram
          </p>
          <a
            href="https://www.instagram.com/nathalia_malinowski/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            @nathalia_malinowski
          </a>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
