'use client'

import { Mail, Phone, Instagram } from 'lucide-react'
import { useSiteText } from '@/lib/siteText'

const Contact = () => {
  const contactTitle = useSiteText('contact_title', 'Vamos conversar?')
  const contactSubtitle = useSiteText('contact_subtitle', 'Me conte sobre seu espaço, seu momento e o que você deseja sentir ao entrar nele. A partir disso, eu te ajudo a entender o melhor caminho para o seu projeto.')
  const contactPhoneLabel = useSiteText('contact_phone_label', '(45) 99802-8130')
  const contactEmailLabel = useSiteText('contact_email_label', 'malinowskinathalia@gmail.com')
  const contactInstagramLabel = useSiteText('contact_instagram_label', '@nathalia_malinowski')
  const contactCta = useSiteText('contact_cta', 'Agendar conversa')
  const contactClosing = useSiteText('contact_closing', 'Vamos criar algo que atravesse o tempo.')

  return (
    <section
      id="contato"
      className="relative py-section md:py-12 lg:py-16 bg-warm-beige paper-texture"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-h2-mobile md:text-h2 font-serif font-semibold text-graphite mb-6">
            {contactTitle}
          </h2>
          <p className="text-body-mobile md:text-body font-sans text-graphite/80 leading-relaxed max-w-2xl mx-auto">
            {contactSubtitle}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-6 mb-12">
          <a
            href="tel:+5545998028130"
            className="flex items-center justify-center gap-4 text-body-mobile md:text-body font-sans font-medium text-graphite hover:text-olive-green transition-colors duration-300"
          >
            <Phone size={24} className="text-soft-terracotta" />
            <span>{contactPhoneLabel}</span>
          </a>

          <a
            href="mailto:malinowskinathalia@gmail.com"
            className="flex items-center justify-center gap-4 text-body-mobile md:text-body font-sans font-medium text-graphite hover:text-olive-green transition-colors duration-300 break-all"
          >
            <Mail size={24} className="text-soft-terracotta" />
            <span>{contactEmailLabel}</span>
          </a>

          <a
            href="https://www.instagram.com/nathalia_malinowski/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-4 text-body-mobile md:text-body font-sans font-medium text-graphite hover:text-olive-green transition-colors duration-300"
          >
            <Instagram size={24} className="text-soft-terracotta" />
            <span>{contactInstagramLabel}</span>
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
            {contactCta}
          </a>
        </div>

        {/* Closing Message */}
        <p className="text-center text-xl md:text-2xl font-serif italic text-olive-green">
          {contactClosing}
        </p>
      </div>
    </section>
  )
}

export default Contact
