const steps = [
  {
    number: '01',
    title: 'Escuta',
    description: 'Entendimento da história, rotina, desejos e referências de quem vai viver o ambiente.',
  },
  {
    number: '02',
    title: 'Narrativa',
    description: 'Definição do conceito, da atmosfera e da intenção que vai guiar todo o projeto.',
  },
  {
    number: '03',
    title: 'Curadoria',
    description: 'Escolha de cores, materiais, objetos, arte e elementos visuais com propósito e coerência.',
  },
  {
    number: '04',
    title: 'Projeto',
    description: 'Organização estética e funcional do ambiente, do layout à definição de acabamentos.',
  },
  {
    number: '05',
    title: 'Presença',
    description: 'Finalização com detalhes que tornam o espaço único, pessoal e verdadeiramente seu.',
  },
]

const Method = () => {
  return (
    <section
      id="metodo"
      className="bg-[#3b2f26] py-20 md:py-28 px-6 sm:px-8 lg:px-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-20 max-w-xl">
          <span className="font-sans text-[9px] font-semibold tracking-[0.22em] uppercase text-[#B89B5E]">
            Como trabalhamos
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-serif font-normal text-[#ebe0e0] leading-[1.2]">
            Método "Espaço com Sentido"
          </h2>
          <div className="mt-5 w-7 h-[1.5px] bg-[#B89B5E] opacity-65" />
          <p className="mt-6 text-[14px] md:text-[16px] font-sans font-light text-[#c5b49f] leading-[1.8]">
            Um processo construído em camadas, do ouvir ao habitar.
          </p>
        </div>

        {/* Steps: 5 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 divide-y divide-[#5a4539] lg:divide-y-0 lg:divide-x lg:divide-[#5a4539]">
          {steps.map((step) => (
            <div
              key={step.number}
              className="py-8 lg:py-0 lg:px-7 first:lg:pl-0 last:lg:pr-0 flex flex-row lg:flex-col gap-5 lg:gap-4"
            >
              <span className="font-serif text-[36px] font-normal text-[#B89B5E]/60 leading-none shrink-0">
                {step.number}
              </span>
              <div>
                <h3 className="font-sans text-[13px] font-semibold tracking-[0.1em] uppercase text-[#ebe0e0]">
                  {step.title}
                </h3>
                <div className="mt-2 w-5 h-[1px] bg-[#B89B5E]/40" />
              </div>
              <p className="text-[12px] md:text-[13px] font-sans font-light text-[#c5b49f] leading-[1.75]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Method
