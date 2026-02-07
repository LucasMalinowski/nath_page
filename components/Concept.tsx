'use client'

import { useSiteText } from '@/lib/siteText'

const Concept = () => {
  const conceptTitle = useSiteText('concept_title', 'Nada é estático.')
  const conceptParagraph = useSiteText(
    'concept_paragraph',
    'Os espaços mudam, as pessoas também. Meu trabalho nasce do encontro entre história, identidade e modo de viver.'
  )

  return (
    <section id="conceito" className="relative py-section bg-text text-bg paper-texture">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 grid md:grid-cols-2 gap-10 items-center">
        <h2 className="text-h1-mobile md:text-h1 font-serif text-gold leading-none">{conceptTitle}</h2>
        <p className="text-h3-mobile md:text-h3 font-sans text-bg/90 max-w-xl">{conceptParagraph}</p>
      </div>
    </section>
  )
}

export default Concept
