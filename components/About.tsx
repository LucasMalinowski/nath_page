'use client'

import Image from 'next/image'

const About = () => {
  return (
    <section
      id="sobre"
      className="relative texture-white"
    >
      <div className="lg:pl-20">
        <div className="flex flex-col lg:flex-row gap-32">
          <div className="w-full lg:w-1/2 py-20 space-y-10">
            <h2 className="text-h2-mobile md:text-6xl font-serif font-semibold text-gold">
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

            <blockquote className="text-2xl md:text-3xl font-poetic italic text-olive leading-snug pt-14">
              Projetar é dar forma ao que faz sentido.
            </blockquote>
          </div>
          {/* Profile Photo */}
          <div className="w-full lg:w-1/2 mr-4 mb-4">
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
