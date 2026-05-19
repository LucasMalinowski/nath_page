'use client'
import Typewriter from '@/components/Typewriter'

const Hero = () => {
  const heroHeadline = 'Design de interiores autoral\npara espaços que fazem sentido\npara quem vive neles.'
  const whatsappHref = 'https://wa.me/5545998028130?text=Ola%20Nathalia%2C%20gostaria%20de%20falar%20sobre%20um%20projeto.'

  return (
    <section id="hero" className="relative h-[90vh] md:h-[90vh] pt-20">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/[0.08] to-transparent"></div>
      </div>

      {/* Text + CTAs (bottom-left) */}
      <div className="relative z-10 h-full max-w-7xl px-6 sm:px-8 lg:px-16">
        <div className="h-full flex items-end pb-12 sm:pb-16">
          <div className="max-w-xl">
            <div className="w-8 h-[1.5px] bg-[#B89B5E]/70 mb-[18px]" />
            <h1 className="text-2xl sm:text-3xl md:text-[30px] font-poetic italic animate-fade-in delay-100 leading-[1.4] text-[#F5F1EB]/96 mb-6">
              <Typewriter text={heroHeadline} classes="text-[#F5F1EB]" />
            </h1>
            <p className="mb-8 max-w-lg text-sm leading-6 text-[#F5F1EB]/85 md:text-base">
              Projetos que unem estética, arte, história e funcionalidade para criar
              ambientes com identidade, presença e significado.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="text-center font-sans text-[11px] font-medium tracking-[0.14em] uppercase bg-[#B89B5E] text-[#F5F1EB] px-[22px] py-[11px] rounded-[4px] transition-all hover:-translate-y-0.5 hover:bg-[#a58a51] hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
              >
                Quero transformar meu espaço
              </a>
              <a
                href="#portfolio"
                className="text-center font-sans text-[11px] font-medium tracking-[0.14em] uppercase text-[#B89B5E] border border-[#B89B5E]/50 px-[22px] py-[10px] rounded-[4px] transition-all hover:-translate-y-0.5 hover:border-[#B89B5E] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
              >
                Conhecer o portfólio
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
