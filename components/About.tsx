'use client'

import Image from 'next/image'

const About = () => {
  return (
    <section
      id="sobre"
      className="relative bg-[#f5f1eb] pt-4"
    >
      <div className="px-6 sm:px-8 lg:pl-20 lg:pr-8 border-b-2 border-[#d9cdb8]/20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(380px,520px)] lg:gap-20 xl:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] xl:gap-24">
          <div className="w-full max-w-[42rem] py-4 space-y-8 lg:space-y-10">
            <h2 className="text-h2-mobile md:text-6xl font-serif font-medium text-gold">
              Sobre mim
            </h2>

            <div className="space-y-6 text-base md:text-xl font-thin font-sans text-text leading-relaxed">
              <p>
                Sou Nathalia Malinowski, designer de interiores e artista plástica. Fundadora e direção criativa da marca, conduzo cada projeto a partir da escuta sensível e da construção de narrativas que unem estética, funcionalidade e significado.
              </p>

              <p>
                Acredito que o design vai além da estética.
                Ele organiza, acolhe e traduz identidade.
                Cada projeto é construído com cuidado, respeitando o tempo e o modo de viver de quem o habita.              </p>
            </div>

            <blockquote className="text-2xl md:text-3xl font-poetic italic text-olive leading-snug pt-6 lg:pt-14">
              Projetar é dar forma ao que faz sentido.
            </blockquote>
          </div>
          {/* Profile Photo */}
          <div className="w-full max-w-[580px] max-h-[680px] justify-self-end">
            <div className="relative w-full aspect-[4/5] overflow-hidden shadow-2xl">
              <Image
                src="/profile-photo.jpeg"
                alt="Nathalia Malinowski"
                fill
                sizes="(min-width: 1280px) 560px, (min-width: 1024px) 520px, 100vw"
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
