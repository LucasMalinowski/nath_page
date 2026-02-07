'use client'

import { useSiteText } from '@/lib/siteText'

const Services = () => {
  const servicesTitle = useSiteText('services_title', 'Serviços')
  const servicesIntro = useSiteText(
    'services_intro',
    'Meus serviços acompanham diferentes momentos, sempre com um olhar autoral, sensível e estruturado.'
  )
  const servicesCta = useSiteText('services_cta', 'Agendar conversa')

  const cards = [
    {
      title: useSiteText('services_1_title', 'Projeto de Interiores Residencial'),
      description: useSiteText(
        'services_1_description',
        'Desenvolvimento completo de projetos residenciais, do conceito à definição de layout, materiais e acabamentos.'
      ),
      poetic: useSiteText('services_1_poetic', 'Projetos pensados em camadas de tempo, história e vivência.'),
    },
    {
      title: useSiteText('services_2_title', 'Consultoria e Curadoria'),
      description: useSiteText(
        'services_2_description',
        'Atendimento estratégico para orientar escolhas estéticas e funcionais, incluindo curadoria de itens decorativos.'
      ),
      poetic: useSiteText('services_2_poetic', 'Pequenas escolhas transformam a experiência do espaço.'),
    },
    {
      title: useSiteText('services_3_title', 'Pinturas Murais Autorais'),
      description: useSiteText(
        'services_3_description',
        'Criação de murais desenvolvidos a partir do espaço e da história de quem o habita.'
      ),
      poetic: useSiteText('services_3_poetic', 'Arte que nasce do espaço.'),
    },
    {
      title: useSiteText('services_4_title', 'Curadoria de Peças Autorais'),
      description: useSiteText(
        'services_4_description',
        'Curadoria de objetos e telas autorais, além de peças de artistas independentes, selecionadas com intenção e propósito.'
      ),
      poetic: useSiteText('services_4_poetic', 'Disponíveis sob curadoria pontual na aba Galeria.'),
    },
  ]

  const scrollToContact = () => {
    const element = document.querySelector('#contato')
    if (!element) return
    const offset = 88
    const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }

  return (
    <section id="servicos" className="py-section bg-bg paper-texture">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="mb-10">
          <h2 className="text-h2-mobile md:text-h2 text-gold mb-4">{servicesTitle}</h2>
          <p className="text-h3-mobile md:text-h3 max-w-3xl text-text">{servicesIntro}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {cards.map((service) => (
            <article key={service.title} className="rounded-card border border-border bg-surface p-6 shadow-soft">
              <h3 className="text-h3-mobile md:text-h3 text-text mb-3">{service.title}</h3>
              <p className="text-body-mobile md:text-body text-text/85">{service.description}</p>
              <p className="poetic text-2xl text-mustard mt-5">{service.poetic}</p>
            </article>
          ))}
        </div>

        <div className="text-center">
          <button onClick={scrollToContact} className="px-10 py-3 rounded-card bg-olive text-bg font-medium hover:bg-moss transition-colors">
            {servicesCta}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Services
