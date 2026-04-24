'use client'
import Link from 'next/link'

const Services = () => {
  const servicesTitle = 'Meus serviços acompanham diferentes momentos,\nsempre com um olhar autoral, sensível e\nestruturado.'
  const servicesSubtitle = 'Um processo sensível, autoral e bem conduzido — do conceito à materialização.'
  const service2Title = 'Consultoria e \n Curadoria'
  const service2Desc = 'Direcionamento estratégico para decisões mais seguras e coerentes com o seu espaço.'
  const service3Title = 'Pinturas Murais\nAutorais'
  const service3Desc = 'Intervenções artísticas que integram o espaço com identidade, presença e significado.'
  const service4Title = 'Galeria de Artes\nOnline'
  const service4Desc = 'Obras autorais e peças selecionadas para compor espaços com identidade e intenção.'
  const service5Title = 'Projeto \n Residencial'
  const service5Desc = 'Desenvolvimento completo do conceito à definição estética e funcional do espaço.'

  const services = [
    {
      number: '01',
      title: service2Title,
      description: service2Desc,
      note: 'Pequenas escolhas transformam a experiência do espaço.'
    },
    {
      number: '02',
      title: service3Title,
      description: service3Desc,
      note: 'Arte que nasce do espaço.'
    },
    {
      number: '03',
      title: service4Title,
      description: service4Desc,
      note: 'Disponíveis sob curadoria pontual na aba Galeria.'
    },
    {
      number: '04',
      title: service5Title,
      description: service5Desc,
      note: 'Projeto que se encaixa no seu espaço.'
    }
  ]

  return (
    <section
      id="servicos"
      className="relative bg-[#f6f2ed] pb-4"
    >
      <div className="flex flex-col lg:flex-row mt-2 md:mt-0 sm:border-t-2 md:border-t-0 border-b-2 border-[#d9cdb8]/40">
        {/* Left: Video — reduce height on mobile so it doesn't dominate before the service cards */}
        <div className="relative min-h-[220px] sm:min-h-[320px] lg:min-h-[760px] lg:w-1/3">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/service-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col lg:w-2/3 mt-4">
          {/* Title block with brown texture */}
          <div className="bg-[#3b2f26] px-6 sm:px-10 py-8">
            <div className="flex gap-6 items-start sm:pl-8">
              <h2 className="whitespace-pre-line text-xl font-light not-italic sm:text-2xl md:text-3xl py-4 font-poetic text-[#ebe0e0] border-l-[3px] border-bg/30 pl-6 pr-0 sm:pl-16 sm:pr-12">
                {servicesTitle}
              </h2>
            </div>
          </div>

          {/* Services grid on white texture */}
          <div className="bg-[#f6f2ed] px-6 py-12 sm:px-8 lg:px-24 lg:py-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-20">
              {services.map((service) => (
                <div key={service.title}>
                  <div className="relative bg-[#FDFAF6] p-6 rounded-[8px] text-[#735746] border border-[#E8DFD2] min-h-[240px]">
                    <div className="w-5 h-[1.5px] bg-[#B89B5E] mb-[14px] opacity-65" />
                    <h3 className="text-h3 font-serif font-semibold mb-3 text-[#3b2f26] whitespace-pre-line leading-[1.3]">
                      {service.title}
                    </h3>
                    <p className="text-[12px] md:text-[15px] font-thin font-sans leading-[1.7] text-[#735746]">
                      {service.description}
                    </p>
                    <Link
                      href="/servicos"
                      className="absolute right-4 bottom-4 flex items-center gap-1 transition-opacity hover:opacity-80"
                      aria-label="Ir para servicos"
                    >
                      <span className="font-sans text-[10px] font-medium tracking-[0.1em] uppercase text-[#B89B5E]">Ver mais</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B89B5E" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                  <p className="mt-3 text-xl font-poetic italic text-[#b89b5e] text-center px-4 sm:px-8 leading-tight">
                    {service.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
