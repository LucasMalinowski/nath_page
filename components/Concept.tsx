'use client'

import { useSiteText, renderTextWithBreaks } from '@/lib/siteText'

const Concept = () => {
  const conceptTitle = useSiteText('concept_title', 'Nada é\nestático.')
  const conceptPoetic = useSiteText('concept_poetic', 'Os espaços mudam, as pessoas também.')
  const conceptParagraph = useSiteText('concept_paragraph', 'Meu trabalho nasce do encontro entre história, identidade e modo de viver.')

  return (
      <section
          id="conceito"
          className="relative my-4 py-8 bg-[url('/carpet.png')] bg-cover bg-center"
      >
        <div className="container mx-auto py-8 px-20 md:px-20 flex flex-col justify-between min-h-[200px] md:min-h-[250px]">
          {/* Título no topo esquerdo */}
          <div className="self-start">
            <h2 className="text-xl md:text-6xl font-serif font-normal text-gold/85 tracking-wide">
              {renderTextWithBreaks(conceptTitle)}
            </h2>
          </div>

          {/* Texto no bottom direito */}
          <div className="self-end max-w-lg mt-8 md:mt-0">
            <p className="text-sm md:text-base lg:text-xl font-sans text-bg/80 text-left leading-relaxed">
              {renderTextWithBreaks(`${conceptPoetic}\n${conceptParagraph}`)}
            </p>
          </div>
        </div>
      </section>
  )
}

export default Concept
