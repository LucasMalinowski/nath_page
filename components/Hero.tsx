'use client'

import Image from 'next/image'
import Typewriter from '@/components/Typewriter'
import { useBrandAsset } from '@/lib/useBrandAsset'
import { useSiteMedia } from '@/lib/useSiteMedia'
import { useSiteText } from '@/lib/siteText'

const Hero = () => {
  const brandAsset = useBrandAsset('hero')
  const heroVideo = useSiteMedia('hero_video')
  const heroHeadline = useSiteText('hero_headline', 'Projetos autorais que unem estética, história e funcionalidade...')
  const heroSubtitle = useSiteText(
    'hero_subtitle',
    'Do conceito à execução, cada escolha é guiada por narrativa, sensibilidade e propósito.'
  )
  const heroCtaPrimary = useSiteText('hero_cta_primary', 'Agendar conversa')
  const heroCtaSecondary = useSiteText('hero_cta_secondary', 'Ver portfólio')

  const logoSize = brandAsset?.width_px && brandAsset?.height_px
    ? { width: `${brandAsset.width_px}px`, height: `${brandAsset.height_px}px` }
    : { width: 'clamp(120px, 16vw, 180px)', height: 'clamp(90px, 12vw, 130px)' }

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId)
    if (!element) return

    const offset = 88
    const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={heroVideo?.url || '/hero-video.mp4'} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-text/55" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-16 text-center text-bg">
        <div className="mb-10 flex justify-center">
          <div className="relative" style={logoSize}>
            <Image
              src={brandAsset?.image_url || '/nm-logo.png'}
              alt={brandAsset?.title || 'NM Logo'}
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>

        <h1 className="text-h1-mobile md:text-h1 font-serif text-balance mb-6 leading-tight">
          <Typewriter text={heroHeadline} speedMs={35} />
        </h1>

        <p className="text-body-mobile md:text-body text-bg/95 max-w-3xl mx-auto mb-10">
          {heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection('#contato')}
            className="px-10 py-3 rounded-card bg-olive text-bg text-body-mobile md:text-body font-medium hover:bg-moss transition-colors"
          >
            {heroCtaPrimary}
          </button>
          <button
            onClick={() => scrollToSection('#portfolio')}
            className="px-10 py-3 rounded-card border border-bg/60 text-bg text-body-mobile md:text-body font-medium hover:bg-bg/10 transition-colors"
          >
            {heroCtaSecondary}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
