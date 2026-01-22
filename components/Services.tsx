'use client'

const Services = () => {
  return (
      <section
          className="relative"
          style={{
            backgroundImage: 'url(/background-texture.jpeg)',
            backgroundSize: 'auto',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
          }}
      >
        <div className="py-8 bg-[#525432]/60">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Section Header */}
            <div className="text-center mb-4">
              <h2
                  className="text-7xl font-bold text-[#ffe8ce] mb-8"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}
              >
                Vamos transformar<br />seu espaço?
              </h2>
              <a
                  href="#contato"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-block px-12 py-4 bg-white/95 hover:bg-white text-coral-500 hover:text-coral-600 font-semibold tracking-wider transition-all duration-300 rounded-full text-sm shadow-lg uppercase"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Entre em Contato
              </a>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto mt-16">
              {/* Card 1 - Projetos personalizados */}
              <div className="space-y-6">
                <div className="bg-[#cdb08e] py-4 px-8">
                  <h3
                      className="text-xl lg:text-2xl font-normal text-white text-center"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                  >
                    Projetos personalizados
                  </h3>
                </div>
                <p
                    className="text-white text-center leading-relaxed text-sm lg:text-base px-4"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Desenvolvimento completo do ambiente, pensado para refletir identidade, funcionalidade e essência.
                </p>
              </div>

              {/* Card 2 - Pinturas e Murais Autorais */}
              <div className="space-y-6">
                <div className="bg-[#cdb08e] py-4 px-8">
                  <h3
                      className="text-xl lg:text-2xl font-normal text-white text-center"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                  >
                    Pinturas e Murais Autorais
                  </h3>
                </div>
                <p
                    className="text-white text-center leading-relaxed text-sm lg:text-base px-4"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Intervenções artísticas exclusivas que conectam o ambiente à história e ao propósito de quem o habita.
                </p>
              </div>

              {/* Card 3 - Consultoria de ambientes */}
              <div className="space-y-6">
                <div className="bg-[#cdb08e] py-4 px-8">
                  <h3
                      className="text-xl lg:text-2xl font-normal text-white text-center"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                  >
                    Consultoria de ambientes
                  </h3>
                </div>
                <p
                    className="text-white text-center leading-relaxed text-sm lg:text-base px-4"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Orientação estratégica para transformar o espaço com soluções práticas, estéticas e acessíveis.
                </p>
              </div>

              {/* Card 4 - Modelagem 3D */}
              <div className="space-y-6">
                <div className="bg-[#cdb08e] py-4 px-8">
                  <h3
                      className="text-xl lg:text-2xl font-normal text-white text-center"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                  >
                    Modelagem 3D
                  </h3>
                </div>
                <p
                    className="text-white text-center leading-relaxed text-sm lg:text-base px-4"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Representação do projeto para facilitar decisões e garantir segurança antes da execução.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Services