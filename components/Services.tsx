'use client'

import { useSiteText } from '@/lib/siteText'

const Services = () => {
  const servicesTitle = useSiteText('services_title', 'Vamos transformar seu espaço?')
  const servicesSubtitle = useSiteText('services_subtitle', 'Um processo sensível, autoral e bem conduzido — do conceito à materialização.')
  const service1Title = useSiteText('services_item_1_title', 'Projetos de Interiores')
  const service1Desc = useSiteText('services_item_1_desc', 'Desenvolvimento completo de ambientes residenciais, com foco em identidade, funcionalidade e estética atemporal. Cada projeto é único, pensado para refletir a essência de quem vive o espaço.')
  const service2Title = useSiteText('services_item_2_title', 'Consultoria de Interiores')
  const service2Desc = useSiteText('services_item_2_desc', 'Orientação estratégica para transformar ambientes de forma prática e personalizada, ideal para quem busca direcionamento estético sem um projeto completo.')
  const service3Title = useSiteText('services_item_3_title', 'Murais e Intervenções Artísticas')
  const service3Desc = useSiteText('services_item_3_desc', 'Criação de pinturas e murais autorais que acrescentam significado, textura e personalidade aos espaços, conectando arte e arquitetura.')
  const service4Title = useSiteText('services_item_4_title', 'Modelagem 3D')
  const service4Desc = useSiteText('services_item_4_desc', 'Visualização do projeto para facilitar decisões com mais segurança, clareza e compreensão do resultado final.')
  const servicesCta = useSiteText('services_cta', 'Entre em contato')

  const services = [
    {
      number: '01',
      title: service1Title,
      description: service1Desc
    },
    {
      number: '02',
      title: service2Title,
      description: service2Desc
    },
    {
      number: '03',
      title: service3Title,
      description: service3Desc
    },
    {
      number: '04',
      title: service4Title,
      description: service4Desc
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
      className="relative py-section md:py-12 lg:py-16 bg-warm-beige paper-texture"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-h2-mobile md:text-h2 font-serif font-semibold text-graphite mb-6">
            {servicesTitle}
          </h2>
          <p className="text-body-mobile md:text-body font-sans text-graphite/80">
            {servicesSubtitle}
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
            {servicesCta}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Services
