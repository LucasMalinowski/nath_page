'use client'
import Link from 'next/link'

const Services = () => {
  const servicesTitle = 'Meus serviços acompanham diferentes momentos, sempre com um olhar autoral, sensível e estruturado.'
  const servicesSubtitle = 'Um processo sensível, autoral e bem conduzido — do conceito à materialização.'
  const service2Title = 'Consultoria e Curadoria'
  const service2Desc = 'Direcionamento estratégico para decisões mais seguras.'
  const service3Title = 'Pinturas Murais\nAutorais'
  const service3Desc = 'Arte integrada ao espaço com identidade e significado.'
  const service4Title = 'Galeria de Artes\nOnline'
  const service4Desc = 'Vendas online de objetos e telas autorais.'

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
    }
  ]

  const scrollToContact = () => {
    const element = document.querySelector('#contato')
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
    <section
      id="servicos"
      className="relative bg-bg pb-4"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left: Video */}
        <div className="relative min-h-[420px] lg:min-h-[760px] lg:w-1/3">
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
          <div className="texture-brown px-6 sm:px-10 py-8">
            <div className="flex gap-6 items-start pl-8">
              <h2 className="text-3xl-mobile md:text-3xl py-4 font-serif text-bg border-l-[3px] border-bg/30  pl-16 pr-12">
                {servicesTitle}
              </h2>
            </div>
          </div>

          {/* Services grid on white texture */}
          <div className="bg-[#f5f1eb] px-24 py-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-20">
              {services.map((service) => (
                <div key={service.title}>
                  <div className="relative bg-[#f6f2ed] border border-[#d5ccb9] p-6 rounded-[22px] text-[#735746] shadow-sm min-h-[240px]">
                    <h3 className="text-h3 font-serif font-semibold mb-6 text-[#3b2f26] whitespace-pre-line leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-body-mobile md:text-body font-thin font-sans leading-relaxed text-[#735746]">
                      {service.description}
                    </p>
                    <a
                      href="#contato"
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToContact()
                      }}
                      className="absolute right-8 bottom-5 text-xl text-[#b89b5e] hover:text-[#a58a51] transition-colors"
                      aria-label="Ir para contato"
                    >
                      →
                    </a>
                  </div>
                  <p className="mt-3 text-xl font-poetic italic text-[#b89b5e] text-center px-8 leading-tight">
                    {service.note}
                  </p>
                </div>
              ))}

              <div className="flex min-h-[240px] items-center justify-center self-start">
                <a
                  href="/galeria#galeria"
                  className="inline-flex items-center justify-center min-w-[290px] px-8 py-3 rounded-full bg-white border border-[#d5ccb9] text-[#735746] text-xl font-sans font-medium hover:bg-[#f0ebe4] transition-colors"
                >
                  Galeria de Artes
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
