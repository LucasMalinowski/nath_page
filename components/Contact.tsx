'use client'

import { Mail, Phone, Instagram } from 'lucide-react'

const Contact = () => {
  return (
    <section id="contato" className="relative bg-[#efece4] py-8 md:py-8">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl leading-tight text-[#d39a78]"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}
            >
              Ficou com alguma dúvida?
              <br />
              Entre em contato comigo
            </h2>
            <div className="space-y-3 text-[#7b5e4a]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <a href="tel:+5545998028130" className="flex items-center gap-3 text-base md:text-lg font-medium">
                <Phone size={20} className="text-[#7b5e4a]" />
                <span>(45) 99802-8130</span>
              </a>
              <a href="mailto:malinowskinathalia@gmail.com" className="flex items-center gap-3 text-base md:text-lg font-medium">
                <Mail size={20} className="text-[#7b5e4a]" />
                <span className="break-all">malinowskinathalia@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="space-y-5 text-left md:pl-8">
            <p
              className="text-lg sm:text-xl md:text-2xl leading-relaxed text-[#7b5e4a]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <span className={"text-[#d39a78]"}>Me siga</span> para acompanhar mais
              <br />
              de perto o meu trabalho!
            </p>
            <a
              href="https://www.instagram.com/nathalia_malinowski/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-base md:text-lg text-[#7b5e4a]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Instagram size={22} className="text-[#7b5e4a]" />
              <span>nathalia_malinowski</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
