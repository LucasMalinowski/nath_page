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
      <div className="flex flex-col lg:flex-row  border-b-2 border-[#d9cdb8]/20">
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
                  <div className="relative bg-[#eee9e2] p-6 rounded-[22px] text-[#735746] shadow-sm min-h-[240px]">
                    <h3 className="text-h3 font-serif font-semibold mb-6 text-[#3b2f26] whitespace-pre-line leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-body-mobile md:text-body font-thin font-sans leading-relaxed text-[#735746]">
                      {service.description}
                    </p>
                    <Link
                      href="/servicos"
                      className="absolute right-8 bottom-5 text-xl text-[#b89b5e] hover:text-[#a58a51] transition-colors"
                      aria-label="Ir para servicos"
                    >
                      →
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
