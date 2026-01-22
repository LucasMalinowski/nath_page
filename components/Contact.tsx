'use client'

import { Mail, Phone, Instagram } from 'lucide-react'

const Contact = () => {
  return (
    <section id="contato" className="relative py-20 md:py-32 bg-beige-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-coral-500 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>
            Ficou com alguma dúvida?<br />
            Entre em contato comigo
          </h2>
        </div>

        {/* Contact Information */}
        <div className="space-y-6 mb-16">
          {/* Phone */}
          <a
            href="tel:+5545998028130"
            className="flex items-center justify-center space-x-3 p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <Phone className="text-coral-500" size={20} />
            <span className="text-base md:text-lg text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              (45) 99802-8130
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:malinowskinathalia@gmail.com"
            className="flex items-center justify-center space-x-3 p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <Mail className="text-coral-500" size={20} />
            <span className="text-base md:text-lg text-gray-700 break-all" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              malinowskinathalia@gmail.com
            </span>
          </a>
        </div>

        {/* Instagram Section */}
        <div className="text-center">
          <p className="text-lg md:text-xl text-coral-500 mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>
            Me siga para acompanhar mais<br />de perto o meu trabalho!
          </p>
          <a
            href="https://www.instagram.com/nathalia_malinowski/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <Instagram size={20} />
            <span>@nathalia_malinowski</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact
