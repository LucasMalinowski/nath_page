'use client'

import { useSiteText, renderTextWithBreaks } from '@/lib/siteText'

const Concept = () => {
  const conceptTitle = useSiteText('concept_title', 'Camadas do Tempo')
  const conceptPoetic = useSiteText('concept_poetic', 'Cada espaço carrega memórias.\nCada escolha constrói uma narrativa.')
  const conceptParagraph = useSiteText('concept_paragraph', 'Meu design parte do encontro entre épocas, referências e afetos, criando ambientes que não seguem tendências passageiras, mas refletem quem você é — hoje e ao longo do tempo.')

  return (
    <section
      id="conceito"
      className="relative py-section md:py-12 lg:py-16 bg-off-white paper-texture"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
        {/* Title */}
        <h2 className="text-h2-mobile md:text-h2 font-serif font-semibold text-graphite mb-12">
          {conceptTitle}
        </h2>

        {/* Poetic Text - Short and with breathing room */}
        <div className="space-y-8 text-xl md:text-2xl font-sans text-graphite leading-relaxed max-w-3xl mx-auto">
          <p className="font-light">
            {renderTextWithBreaks(conceptPoetic)}
          </p>

          <p className="text-body-mobile md:text-body font-sans leading-relaxed">
            {conceptParagraph}
          </p>
        </div>
      </div>
    </section>
  )
}

export default Concept
