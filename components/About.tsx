'use client'

import Image from 'next/image'

const About = () => {
  return (
    <section
      id="sobre"
      className="relative py-section md:py-24 lg:py-32 bg-warm-beige paper-texture"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <h2 className="text-h2-mobile md:text-h2 font-serif font-semibold text-graphite">
              Sobre mim
            </h2>

            <div className="space-y-6 text-body-mobile md:text-body font-sans text-graphite leading-relaxed">
              <p>
                Sou Nathalia Malinowski, designer de interiores e artista muralista.
                Meu trabalho nasce da escuta atenta e da sensibilidade em traduzir histórias, 
                estilos e vivências em espaços que fazem sentido para quem os habita.
              </p>

              <p>
                Acredito em um design que vai além da estética: que acolhe, que respeita o tempo 
                e que constrói identidade. Cada projeto é pensado como uma composição de camadas — 
                do clássico ao contemporâneo, do vivido ao novo — sempre com propósito e significado.
              </p>
            </div>

            {/* Featured Quote */}
            <blockquote className="text-2xl md:text-3xl font-serif italic text-olive-green leading-snug border-l-4 border-soft-terracotta pl-6 py-2">
              Projetar é interpretar histórias e transformá-las em espaços.
            </blockquote>
          </div>

          {/* Profile Photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/profile-photo.jpeg"
                alt="Nathalia Malinowski"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
