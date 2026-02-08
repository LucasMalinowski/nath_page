'use client'

import Image from 'next/image'
import { useSiteText } from '@/lib/siteText'

const About = () => {
  const aboutTitle = useSiteText('about_title', 'Sobre mim')
  const aboutParagraph1 = useSiteText('about_paragraph_1', 'Sou Nathalia Malinowski, designer de interiores e artista. Meu trabalho nasce da escuta atenta e da observação sensível dos espaços e das pessoas.')
  const aboutParagraph2 = useSiteText('about_paragraph_2', 'Acredito em o design que vai além da estética: ele organiza, acolhe e traduz identidade. Cada projeto é pensado como uma construção cuidadosa, respeitando o tempo, a história e o modo de viver de quem habita o espaço.')
  const aboutQuote = useSiteText('about_quote', 'Projetar é dar forma ao que faz sentido.')

  return (
    <section
      id="sobre"
      className="relative bg-bg paper-texture"
    >
      <div className="lg:pl-20">
        <div className="flex flex-col lg:flex-row gap-32">
          <div className="w-full lg:w-1/2 py-20 space-y-10">
            <h2 className="text-h2-mobile md:text-6xl font-serif font-semibold text-gold">
              {aboutTitle}
            </h2>

            <div className="space-y-6 text-xl-mobile md:text-xl font-thin font-sans text-text leading-relaxed">
              <p>
                {aboutParagraph1}
              </p>

              <p>
                {aboutParagraph2}
              </p>
            </div>

            <blockquote className="text-2xl md:text-3xl font-poetic italic text-olive leading-snug pt-14">
              {aboutQuote}
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
