'use client'

import Image from 'next/image'

const About = () => {
  return (
      <section id="sobre" className="relative  bg-floral-overlay">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-floral-overlay bg-[#525432]/60 px-48">
          {/* Left side - Text with darker green overlay background */}
          <div className="relative py-16 md:py-20 px-8 sm:px-12 lg:px-16">
            <div className="absolute inset-0"></div>
            <div className="relative space-y-5 max-w-xl">
              <h2 className="text-7xl font-bold text-[#ffe8ce] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>
                Sobre mim
              </h2>

              <p className="text-lg md:text-lg text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                Sou Nathalia Malinowski, designer de interiores e artista muralista. Transformo ambientes em extensões da personalidade e da história de cada cliente.
              </p>

              <p className="text-3xl text-[#ffe8ce]" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}>
                Cada projeto nasce da escuta, da sensibilidade e do propósito.
              </p>

              <p className="text-lg md:text-lg text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                Acredito que o design vai além da estética. Ele nutre o corpo, a mente e a alma, criando espaços que acolhem, funcionam e fazem sentido no dia a dia.
              </p>

              <p className="text-lg md:text-lg text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                Meu trabalho traduz histórias em soluções autorais, onde cada detalhe, do mais sutil ao mais marcante, carrega significado.
              </p>
            </div>
          </div>

          {/* Right side - Pattern background with photo */}
          <div className="relative flex items-end justify-center lg:justify-end py-0 px-6 sm:px-8 lg:px-12 ">
            <div className="relative w-80 h-96 md:w-96 md:h-[480px] lg:w-[420px] lg:h-[550px] overflow-hidden shadow-2xl" style={{ borderRadius: '50% 50% 0 0' }}>
              <Image
                  src="/profile-photo.jpeg"
                  alt="Nathalia Malinowski"
                  fill
                  className="object-cover object-top"
                  priority
              />
            </div>
          </div>
        </div>
      </section>
  )
}

export default About