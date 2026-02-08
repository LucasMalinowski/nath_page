'use client'

import { useSiteMedia } from '@/lib/useSiteMedia'
import { useSiteText } from '@/lib/siteText'
import Typewriter from '@/components/Typewriter'

const Hero = () => {
  const heroVideo = useSiteMedia('hero_video')
  const heroHeadline = useSiteText('hero_headline', 'Projetos autorais que unem estética,\nhistória e funcionalidade...')

  return (
    <section id="hero" className="relative h-[90vh] md:h-[90vh] pt-20">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo?.url || '/hero-video.mp4'} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Typewriter text (bottom-left) */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="h-full flex items-end pb-12 sm:pb-16">
          <h1 className="sm:text-xl md:text-2xl lg:text-2xl font-poetic italic animate-fade-in delay-100 leading-relaxed">
            <Typewriter text={heroHeadline}
                        classes={"text-[#F5F1EB]/90"} />
          </h1>
        </div>
      </div>
    </section>
  )
}

export default Hero