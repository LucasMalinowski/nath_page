'use client'

import Image from 'next/image'
import { useSiteText } from '@/lib/siteText'

const About = () => {
  const aboutTitle = useSiteText('about_title', 'Sobre mim')
  const aboutParagraph1 = useSiteText(
    'about_paragraph_1',
    'Sou Nathalia Malinowski, designer de interiores e artista. Meu trabalho nasce da escuta atenta e da observação sensível dos espaços e das pessoas.'
  )
  const aboutParagraph2 = useSiteText(
    'about_paragraph_2',
    'Acredito que o design vai além da estética: ele organiza, acolhe e traduz identidade. Cada projeto é pensado como uma construção cuidadosa, respeitando o tempo, a história e o modo de viver de quem habita o espaço.'
  )
  const aboutQuote = useSiteText('about_quote', 'Projetar é dar forma ao que faz sentido.')

  return (
    <section id="sobre" className="py-section bg-bg paper-texture">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch border border-border rounded-card overflow-hidden bg-surface shadow-soft">
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <h2 className="text-h1-mobile md:text-h1 text-gold mb-8">{aboutTitle}</h2>
            <div className="space-y-6 text-body-mobile md:text-body text-text/90">
              <p>{aboutParagraph1}</p>
              <p>{aboutParagraph2}</p>
            </div>
            <p className="poetic text-3xl md:text-4xl text-moss mt-10">{aboutQuote}</p>
          </div>

          <div className="relative min-h-[420px]">
            <Image src="/profile-photo.jpeg" alt="Nathalia Malinowski em retrato externo" fill className="object-cover" priority />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
