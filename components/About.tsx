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

            <div className="space-y-6 text-xl-mobile md:text-xl font-thin font-sans text-text leading-relaxed">
              <p>
                Sou Nathalia Malinowski, designer de interiores e artista. Meu trabalho nasce da escuta atenta e da observação sensível dos espaços e das pessoas.
              </p>

              <p>
                Acredito em o design que vai além da estética: ele organiza, acolhe e traduz identidade. Cada projeto é pensado como uma construção cuidadosa, respeitando o tempo, a história e o modo de viver de quem habita o espaço.
              </p>
            </div>

            <blockquote className="text-2xl md:text-3xl font-poetic italic text-olive leading-snug pt-6 lg:pt-14">
              Projetar é dar forma ao que faz sentido.
            </blockquote>
          </div>
          {/* Profile Photo */}
          <div className="w-full max-w-[560px] justify-self-end">
            <div className="relative w-full aspect-square overflow-hidden shadow-2xl">
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
