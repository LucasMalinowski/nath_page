'use client'
import Link from 'next/link'

const Services = () => {
  const servicesTitle = 'Meus serviços acompanham diferentes momentos, sempre com um olhar autoral, sensível e estruturado.'
  const servicesSubtitle = 'Um processo sensível, autoral e bem conduzido — do conceito à materialização.'
  const service1Title = 'Projeto de Interiores Residencial'
  const service1Desc = 'Desenvolvimento completo de projetos residenciais, do conceito à definição de layout, materiais e acabamentos.'
  const service2Title = 'Consultoria e Curadoria'
  const service2Desc = 'Atendimento estratégico para orientar escolhas estéticas e funcionais, incluindo curadoria de itens decorativos.'
  const service3Title = 'Pinturas Murais Autorais'
  const service3Desc = 'Criação de murais desenvolvidos a partir do espaço e da história de quem o habita.'
  const service4Title = 'Curadoria e Peças Autorais'
  const service4Desc = 'Curadoria de objetos e telas autorais, além de peças de artistas independentes, selecionadas com intenção e propósito.'
  const servicesCta = 'Saber mais'

  const services = [
    {
      number: '01',
      title: service1Title,
      description: service1Desc,
      note: 'Projetos pensados em camadas de tempo, história e vivência.'
    },
    {
      number: '02',
      title: service2Title,
      description: service2Desc,
      note: 'Pequenas escolhas transformam a experiência do espaço.'
    },
    {
      number: '03',
      title: service3Title,
      description: service3Desc,
      note: 'Arte que nasce do espaço.'
    },
    {
      number: '04',
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
      className="relative bg-bg mb-4"
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
          <div className="texture-white px-24 py-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-20">
              {services.map((service, index) => (
                <div key={index}>
                  <div className="bg-[#f6f2ed] border border-border/50 p-6 rounded-xl text-[#735746] shadow-sm min-h-[240px]">
                    <h3 className="text-h3 font-serif font-semibold  mb-6">
                      {service.title}
                    </h3>
                    <p className="text-body-mobile md:text-body font-thin font-sans leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <p className="mt-3 text-xl font-poetic italic text-gold text-center px-8">
                    {service.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Link
                  href="/servicos"
                  className="inline-block btn-primary px-10 py-3 bg-gold/80 text-bg font-sans font-medium rounded-button text-lg tracking-wide hover:bg-gold transition-all duration-300"
              >
                {servicesCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
