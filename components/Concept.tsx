'use client'

const renderTextWithBreaks = (text: string) => {
  const parts = text.split('\n')
  return parts.map((part, index) => (
    <span key={`${index}-${part}`}>
      {part}
      {index < parts.length - 1 && <br />}
    </span>
  ))
}

const Concept = () => {
  const conceptTitle = 'Nada é\nestático.'
  const conceptPoetic = 'Os espaços mudam, as pessoas também.'
  const conceptParagraph = 'Meu trabalho nasce do encontro entre história, identidade e modo de viver.'

  return (
      <section
          id="conceito"
          className="relative mt-4 py-8 bg-[url('/carpet.png')] md:bg-cover bg-center"
      >
        {/* Mobile: gap-10 lets content flow naturally (no clipping from justify-between).
            md+: justify-between pushes description to bottom-right corner — original desktop layout. */}
        <div className="container py-8 px-6 sm:px-8 md:px-20 flex flex-col gap-10 md:gap-0 md:justify-between md:min-h-[250px]">
          {/* Título no topo esquerdo */}
          <div className="self-start">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal text-gold/85 tracking-wide">
              {renderTextWithBreaks(conceptTitle)}
            </h2>
          </div>

          {/* Texto no bottom direito — md:self-end keeps desktop right-aligned; mobile flows left */}
          <div className="md:self-end max-w-lg">
            <p className="text-base md:text-base lg:text-xl font-sans font-light text-bg/80 text-left leading-relaxed">
              {renderTextWithBreaks(`${conceptPoetic}\n${conceptParagraph}`)}
            </p>
          </div>
        </div>
      </section>
  )
}

export default Concept
