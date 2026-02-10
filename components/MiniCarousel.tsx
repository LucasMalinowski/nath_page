'use client'

import { useState, useEffect, TouchEvent, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MiniCarouselProps {
    images: string[]
    alt: string
    pauseUntil?: number
    onUserNavigate?: () => void
}

export function MiniCarousel({ images, alt, pauseUntil = 0, onUserNavigate }: MiniCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const [reducedMotion, setReducedMotion] = useState(false)
    const [prevIndex, setPrevIndex] = useState(0)
    const [isFading, setIsFading] = useState(false)
    const [fadeIn, setFadeIn] = useState(true)
    const fadeTimeout = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setReducedMotion(mediaQuery.matches)

        const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    useEffect(() => {
        if (reducedMotion) return
        if (prevIndex === currentIndex) return
        setIsFading(true)
        setFadeIn(false)
        requestAnimationFrame(() => setFadeIn(true))
        if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
        fadeTimeout.current = setTimeout(() => {
            setIsFading(false)
            setPrevIndex(currentIndex)
        }, 500)

        return () => {
            if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
        }
    }, [currentIndex, prevIndex, reducedMotion])

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToImage = (index: number) => {
        setCurrentIndex(index)
    }

    useEffect(() => {
        if (images.length <= 1 || reducedMotion) return
        const interval = setInterval(() => {
            if (Date.now() < pauseUntil) return
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
        }, 5000)

        return () => clearInterval(interval)
    }, [images.length, pauseUntil, reducedMotion])

    // Touch handlers for swipe
    const handleTouchStart = (e: TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50

        if (isLeftSwipe) nextImage()
        if (isRightSwipe) prevImage()

        setTouchStart(0)
        setTouchEnd(0)
    }

    // Single image - no carousel needed
    if (images.length <= 1) {
        return (
            <div className="relative flex-1 min-h-[250px] md:min-h-[300px] p-3 md:p-4">
                <div className="relative w-full h-full rounded-sm overflow-hidden">
                    <Image
                        src={images[0]}
                        alt={alt}
                        fill
                        className="object-cover"
                        quality={90}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                </div>
            </div>
        )
    }

    return (
        <div
            className="relative flex-1 min-h-[250px] md:min-h-[300px] group/carousel p-3 md:p-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Main Image */}
            <div className="relative w-full h-full rounded-sm overflow-hidden">
                {!reducedMotion && prevIndex !== currentIndex && (
                    <Image
                        src={images[prevIndex]}
                        alt={`${alt} - ${prevIndex + 1}`}
                        fill
                        className={`object-cover transition-opacity duration-500 ease-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
                        quality={90}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                )}
                <Image
                    src={images[currentIndex]}
                    alt={`${alt} - ${currentIndex + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-500 ease-out ${
                        reducedMotion ? '' : fadeIn ? 'opacity-100' : 'opacity-0'
                    }`}
                    quality={90}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
            </div>

            {/* Navigation Buttons - Always visible when multiple images */}
            {images.length > 1 && (
                <div className="absolute inset-3 flex items-center justify-between pointer-events-none">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onUserNavigate?.()
                            prevImage()
                        }}
                        className="w-7 h-7 bg-bg/90 hover:bg-bg rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                        aria-label="Imagem anterior"
                    >
                        <ChevronLeft size={16} className="text-olive" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onUserNavigate?.()
                            nextImage()
                        }}
                        className="w-7 h-7 bg-bg/90 hover:bg-bg rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                        aria-label="Próxima imagem"
                    >
                        <ChevronRight size={16} className="text-olive" />
                    </button>
                </div>
            )}

            {/* Image Counter - Discrete */}
            <div className="absolute top-3 right-3 bg-bg/80 text-text px-2 py-0.5 rounded text-xs font-sans font-medium shadow z-10">
                {currentIndex + 1}/{images.length}
            </div>

            {/* Dots Indicator - Discrete */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-1 z-10">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            goToImage(index)
                        }}
                        className={`h-1 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? 'bg-gold w-4'
                                : 'bg-bg/50 w-1 hover:bg-bg/80'
                        }`}
                        aria-label={`Ir para imagem ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
