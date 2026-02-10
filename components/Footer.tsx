'use client'

import { Mail, Phone, Instagram } from 'lucide-react'

type FooterProps = {
    contactInfo?: boolean
}
const Footer = ({contactInfo = true}: FooterProps) => {
  return (
    <footer className="relative bg-[#6b7a5e] text-bg">
      { contactInfo && (

        <div className="texture-green">
          <div className="px-6 sm:px-8 lg:px-16">
            <div className="mx-10 py-8">
              <div className="text-center mb-6">
                <p className="text-3xl font-serif">
                  Vamos criar um espaço que
                  <br />
                  faça sentido para você?
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3 md:items-center">
                <div className="space-y-2 text-sm text-bg/80 min-w-[100px] md:justify-self-start">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gold/80" />
                    <span>(45) 99802-8130</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Instagram size={16} className="text-gold/80" />
                    <span>nathalia_malinowski</span>
                  </div>
                </div>

                <div className="flex justify-center md:justify-self-center">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-md bg-mustard text-text font-sans text-sm md:text-base shadow-sm"
                  >
                    Agendar conversa
                  </button>
                </div>

                <div className="text-sm text-bg/80 flex items-center gap-2 md:justify-self-end md:justify-end">
                  <Mail size={16} className="text-gold/80" />
                  <span>malinowskinathalia@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-moss/30 py-3 text-center">
        <img src="/nm-white.png" alt="NM" className="mx-auto h-12 w-auto"/>
      </div>
    </footer>
  )
}

export default Footer
