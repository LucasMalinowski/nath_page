'use client'

const Services = () => {
  const services = [
    {
      number: '01',
      title: 'Projetos de Interiores',
      description: 'Desenvolvimento completo de ambientes residenciais, com foco em identidade, funcionalidade e estética atemporal. Cada projeto é único, pensado para refletir a essência de quem vive o espaço.'
    },
    {
      number: '02',
      title: 'Consultoria de Interiores',
      description: 'Orientação estratégica para transformar ambientes de forma prática e personalizada, ideal para quem busca direcionamento estético sem um projeto completo.'
    },
    {
      number: '03',
      title: 'Murais e Intervenções Artísticas',
      description: 'Criação de pinturas e murais autorais que acrescentam significado, textura e personalidade aos espaços, conectando arte e arquitetura.'
    },
    {
      number: '04',
      title: 'Modelagem 3D',
      description: 'Visualização do projeto para facilitar decisões com mais segurança, clareza e compreensão do resultado final.'
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
      className="relative py-section md:py-24 lg:py-32 bg-warm-beige paper-texture"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-h2-mobile md:text-h2 font-serif font-semibold text-graphite mb-6">
            Vamos transformar seu espaço?
          </h2>
          <p className="text-body-mobile md:text-body font-sans text-graphite/80">
            Um processo sensível, autoral e bem conduzido — do conceito à materialização.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-off-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Service Number */}
              <div className="text-soft-terracotta font-sans font-bold text-lg mb-4">
                {service.number}
              </div>

              {/* Service Title */}
              <h3 className="text-h3 font-serif font-semibold text-graphite mb-4">
                {service.title}
              </h3>

              {/* Service Description */}
              <p className="text-body-mobile md:text-body font-sans text-graphite/80 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={scrollToContact}
            className="btn-primary px-12 py-4 bg-olive-green text-off-white font-sans font-medium rounded-button text-base tracking-wide hover:bg-soft-terracotta transition-all duration-300"
          >
            Entre em contato
          </button>
        </div>
      </div>
    </section>
  )
}

export default Services
