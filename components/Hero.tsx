'use client'
import Typewriter from '@/components/Typewriter'

const Hero = () => {
  const heroHeadline = 'Projetos que unem estética,\nhistória e funcionalidade.'

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
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/[0.08] to-transparent"></div>
      </div>

      {/* Text + CTA (bottom-left) */}
      <div className="relative z-10 h-full max-w-7xl px-6 sm:px-8 lg:px-16">
        <div className="h-full flex items-end pb-12 sm:pb-16">
          <div className="max-w-xl">
            <div className="w-8 h-[1.5px] bg-[#B89B5E]/70 mb-[18px]" />
            <h1 className="text-2xl sm:text-3xl md:text-[30px] font-poetic italic animate-fade-in delay-100 leading-[1.4] text-[#F5F1EB]/96 mb-6">
              <Typewriter text={heroHeadline}
                          classes={"text-[#F5F1EB]"} />
            </h1>
            <a
              href="#portfolio"
              className="inline-block font-sans text-[11px] font-medium tracking-[0.14em] uppercase text-[#B89B5E] border border-[#B89B5E]/50 px-[22px] py-[7px] rounded-[4px] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            >
              Ver portfólio
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
