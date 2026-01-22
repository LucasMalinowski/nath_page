'use client'

const Services = () => {
  return (
    <section className="relative py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-8" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>
            Vamos transformar<br />seu espaço?
          </h2>
          <a
            href="#contato"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-block px-12 py-3 bg-white border-2 border-gray-300 hover:border-coral-500 text-gray-700 hover:text-coral-600 font-normal tracking-wider transition-all duration-300 rounded-full text-sm"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            ENTRE EM CONTATO
          </a>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mt-16">
          {/* Card 1 - Projetos personalizados */}
          <div className="bg-beige-100 p-8 lg:p-10 rounded-none transition-shadow duration-300">
            <h3 className="text-xl lg:text-2xl font-normal text-gray-800 mb-4 text-center" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>
              Projetos personalizados
            </h3>
            <p className="text-gray-700 text-center leading-relaxed text-sm lg:text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Desenvolvimento completo do ambiente, pensado para refletir identidade, funcionalidade e essência.
            </p>
          </div>

          {/* Card 2 - Pinturas e Murais Autorais */}
          <div className="bg-beige-100 p-8 lg:p-10 rounded-none transition-shadow duration-300">
            <h3 className="text-xl lg:text-2xl font-normal text-gray-800 mb-4 text-center" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>
              Pinturas e Murais Autorais
            </h3>
            <p className="text-gray-700 text-center leading-relaxed text-sm lg:text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Intervenções artísticas exclusivas que conectam o ambiente à história e ao propósito de quem o habita.
            </p>
          </div>

          {/* Card 3 - Consultoria de ambientes */}
          <div className="bg-beige-100 p-8 lg:p-10 rounded-none transition-shadow duration-300">
            <h3 className="text-xl lg:text-2xl font-normal text-gray-800 mb-4 text-center" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>
              Consultoria de ambientes
            </h3>
            <p className="text-gray-700 text-center leading-relaxed text-sm lg:text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Orientação estratégica para transformar o espaço com soluções práticas, estéticas e acessíveis.
            </p>
          </div>

          {/* Card 4 - Modelagem 3D */}
          <div className="bg-beige-100 p-8 lg:p-10 rounded-none transition-shadow duration-300">
            <h3 className="text-xl lg:text-2xl font-normal text-gray-800 mb-4 text-center" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>
              Modelagem 3D
            </h3>
            <p className="text-gray-700 text-center leading-relaxed text-sm lg:text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Representação do projeto para facilitar decisões e garantir segurança antes da execução.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
