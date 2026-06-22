const ArtSection = () => {
  const services = [
    'Projeto Residencial',
    'Consultoria',
    'Curadoria',
    'Murais Autorais',
    'Galeria de Artes',
  ]

  return (
    <section
      id="design-arte"
      className="bg-[#f5f1eb] py-20 md:py-28 px-6 sm:px-8 lg:px-20"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left: decorative column */}
        <div className="hidden lg:flex flex-col items-start border-l border-[#B89B5E]/30 pl-8 py-2">
          <p className="font-sans text-[11px] font-semibold tracking-[0.22em] uppercase text-[#B89B5E]">
            Uma abordagem que nasce da escuta
          </p>
          <div className="mt-8 w-full border-t border-[#d9cdb8]/50" />
          <div className="mt-8 space-y-3">
            {services.map((service) => (
              <p
                key={service}
                className="font-sans text-[12px] tracking-[0.08em] text-[#9f8a74] uppercase"
              >
                {service}
              </p>
            ))}
          </div>
        </div>

        {/* Right: content */}
        <div className="space-y-8">
          <span className="font-sans text-[9px] font-semibold tracking-[0.22em] uppercase text-[#B89B5E]">
            Entre o design e a arte
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-serif font-normal text-[#3b2f26] leading-[1.2]">
            Design que carrega <br className="hidden sm:block" />
            história e intenção.
          </h2>

          <div className="w-7 h-[1.5px] bg-[#B89B5E] opacity-65" />

          <div className="space-y-5 text-[14px] md:text-[17px] font-sans font-light text-[#735746] leading-[1.85]">
            <p>
              Minha abordagem une design de interiores, arte autoral e curadoria para criar
              espaços únicos. Cada projeto nasce da escuta, da história de quem vive o
              ambiente e da busca por uma estética que seja bonita, funcional e
              profundamente pessoal.
            </p>
            <p>
              Ser designer e artista plástica ao mesmo tempo significa que cada espaço
              que projeto carrega não apenas função, mas sensibilidade e um olhar que
              enxerga o ambiente como composição, narrativa e identidade viva.
            </p>
          </div>

          {/* Mobile: services list stacked */}
          <div className="flex flex-col gap-2 lg:hidden pt-2 border-t border-[#d9cdb8]/50">
            {services.map((service) => (
              <span key={service} className="font-sans text-[11px] tracking-[0.08em] text-[#9f8a74] uppercase pt-2">
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArtSection
