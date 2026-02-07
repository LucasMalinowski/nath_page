'use client'

import { Mail, Phone, Instagram, MessageCircle } from 'lucide-react'
import { useSiteText } from '@/lib/siteText'

const Contact = () => {
  const contactTitle = useSiteText('contact_title', 'Vamos criar um espaço que faça sentido para você?')
  const contactPhoneLabel = useSiteText('contact_phone_label', '(45) 99802-8130')
  const contactEmailLabel = useSiteText('contact_email_label', 'malinowskinathalia@gmail.com')
  const contactInstagramLabel = useSiteText('contact_instagram_label', 'nathalia_malinowski')
  const contactCta = useSiteText('contact_cta', 'Agendar conversa')

  return (
    <section id="contato" className="py-section bg-moss text-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
        <h2 className="text-h1-mobile md:text-h1 mb-10">{contactTitle}</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10 text-left max-w-5xl mx-auto">
          <a href="tel:+5545998028130" className="rounded-card border border-bg/30 p-4 flex items-center gap-3 hover:bg-bg/10 transition-colors">
            <Phone className="text-mustard" />
            <span className="text-body-mobile md:text-body">{contactPhoneLabel}</span>
          </a>

          <a href="https://instagram.com/nathalia_malinowski" target="_blank" rel="noopener noreferrer" className="rounded-card border border-bg/30 p-4 flex items-center gap-3 hover:bg-bg/10 transition-colors">
            <Instagram className="text-mustard" />
            <span className="text-body-mobile md:text-body">{contactInstagramLabel}</span>
          </a>

          <a href="mailto:malinowskinathalia@gmail.com?subject=Projeto%20de%20Interiores" className="rounded-card border border-bg/30 p-4 flex items-center gap-3 hover:bg-bg/10 transition-colors">
            <Mail className="text-mustard" />
            <span className="text-body-mobile md:text-body break-all">{contactEmailLabel}</span>
          </a>
        </div>

        <a
          href="https://wa.me/5545998028130?text=Ol%C3%A1%20Nathalia%2C%20quero%20falar%20sobre%20um%20projeto%20de%20interiores."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-card bg-mustard text-text text-body-mobile md:text-body font-medium hover:bg-gold transition-colors"
        >
          <MessageCircle size={20} />
          {contactCta}
        </a>
      </div>
    </section>
  )
}

export default Contact
