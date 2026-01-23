'use client'

import Image from 'next/image'

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay with green tint as per document (20-30% opacity) */}
        <div className="absolute inset-0 bg-olive-green/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
        {/* Logo Overlay */}
        <div className="mb-12 animate-fade-in flex justify-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
            <Image
              src="/nm-logo.png"
              alt="NM Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-hero font-serif font-medium text-off-white mb-6 animate-fade-in delay-100 leading-tight">
          Design de interiores com história,<br />sensibilidade e identidade.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-off-white/90 font-sans mb-12 max-w-3xl mx-auto animate-fade-in delay-200 leading-relaxed">
          Projetos autorais que unem o clássico ao vivido, criando espaços atemporais, afetivos e cheios de significado.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-300">
          {/* Primary CTA */}
          <button
            onClick={() => scrollToSection('#contato')}
            className="btn-primary px-10 py-4 bg-olive-green text-off-white font-sans font-medium rounded-button text-base tracking-wide hover:bg-soft-terracotta transition-all duration-300"
          >
            Agendar conversa
          </button>

          {/* Secondary CTA */}
          <button
            onClick={() => scrollToSection('#portfolio')}
            className="px-10 py-4 bg-transparent border-2 border-off-white text-off-white font-sans font-medium rounded-button text-base tracking-wide hover:bg-off-white hover:text-olive-green transition-all duration-300"
          >
            Ver portfólio
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
