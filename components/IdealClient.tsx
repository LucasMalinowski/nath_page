const qualifiers = [
  'Quem valoriza a arte no dia a dia',
  'Quem quer um espaço com história',
  'Quem busca identidade no ambiente',
]

const IdealClient = () => {
  const whatsappHref =
    'https://wa.me/5545998028130?text=Ola%20Nathalia%2C%20gostaria%20de%20falar%20sobre%20um%20projeto.'

  return (
    <section
      id="para-quem"
      className="bg-[#EEE9E2] py-20 md:py-28 px-6 sm:px-8 lg:px-20"
    >
      <div className="max-w-4xl mx-auto text-center">
        <span className="font-sans text-[9px] font-semibold tracking-[0.22em] uppercase text-[#B89B5E]">
          Para quem é este trabalho
        </span>

        <h2 className="mt-5 text-3xl md:text-4xl lg:text-[44px] font-serif font-normal text-[#3b2f26] leading-[1.2]">
          Para quem busca mais do que<br className="hidden sm:block" /> um ambiente bonito
        </h2>

        <div className="mt-6 mx-auto w-7 h-[1.5px] bg-[#B89B5E] opacity-65" />

        <p className="mt-8 text-[15px] md:text-[18px] font-sans font-light text-[#735746] leading-[1.85] max-w-2xl mx-auto">
          Este trabalho é para pessoas que desejam transformar seus espaços com
          intenção, sensibilidade e identidade. Para quem valoriza arte, memória,
          afeto e funcionalidade e quer viver em um ambiente que traduza
          seu modo de ser.
        </p>

        {/* Qualifiers */}
        <div className="mt-12 flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center md:gap-x-0 md:gap-y-3">
          {qualifiers.map((qualifier, index) => (
            <span
              key={qualifier}
              className="font-poetic italic text-[18px] md:text-[20px] text-[#9f8a74] leading-snug"
            >
              {qualifier}
              {index < qualifiers.length - 1 && (
                <span className="hidden md:inline not-italic font-sans text-[14px] text-[#d9cdb8] mx-6">·</span>
              )}
            </span>
          ))}
        </div>

        <div className="mt-12">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-block font-sans text-[12px] font-medium tracking-[0.14em] uppercase bg-[#3b2f26] text-[#f5f1eb] px-8 py-[11px] rounded-[4px] transition-all hover:-translate-y-0.5 hover:bg-[#2e231c] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
          >
            Agendar uma conversa
          </a>
        </div>
      </div>
    </section>
  )
}

export default IdealClient
