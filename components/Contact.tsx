'use client'

import { Mail, Phone, Instagram } from 'lucide-react'

const Contact = () => {
  return (
    <section
      id="contato"
      className="relative py-section md:py-12 lg:py-16 bg-warm-beige paper-texture"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-h2-mobile md:text-h2 font-serif font-semibold text-graphite mb-6">
            Vamos conversar?
          </h2>
          <p className="text-body-mobile md:text-body font-sans text-graphite/80 leading-relaxed max-w-2xl mx-auto">
            Me conte sobre seu espaço, seu momento e o que você deseja sentir ao entrar nele.
            A partir disso, eu te ajudo a entender o melhor caminho para o seu projeto.
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-6 mb-12">
          <a
            href="tel:+5545998028130"
            className="flex items-center justify-center gap-4 text-body-mobile md:text-body font-sans font-medium text-graphite hover:text-olive-green transition-colors duration-300"
          >
            <Phone size={24} className="text-soft-terracotta" />
            <span>(45) 99802-8130</span>
          </a>

          <a
            href="mailto:malinowskinathalia@gmail.com"
            className="flex items-center justify-center gap-4 text-body-mobile md:text-body font-sans font-medium text-graphite hover:text-olive-green transition-colors duration-300 break-all"
          >
            <Mail size={24} className="text-soft-terracotta" />
            <span>malinowskinathalia@gmail.com</span>
          </a>

          <a
            href="https://www.instagram.com/nathalia_malinowski/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-4 text-body-mobile md:text-body font-sans font-medium text-graphite hover:text-olive-green transition-colors duration-300"
          >
            <Instagram size={24} className="text-soft-terracotta" />
            <span>@nathalia_malinowski</span>
          </a>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-12">
          <a
            href="https://wa.me/5545998028130"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block btn-primary px-12 py-4 bg-olive-green text-off-white font-sans font-medium rounded-button text-base tracking-wide hover:bg-soft-terracotta transition-all duration-300"
          >
            Agendar conversa
          </a>
        </div>

        {/* Closing Message */}
        <p className="text-center text-xl md:text-2xl font-serif italic text-olive-green">
          Vamos criar algo que atravesse o tempo.
        </p>
      </div>
    </section>
  )
}

export default Contact
