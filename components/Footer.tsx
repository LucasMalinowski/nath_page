'use client'

import Image from 'next/image'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-sage-700 border-t border-sage-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* NM Logo */}
          <div className="text-center">
            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
              <Image
                src="/nm-logo.png"
                alt="NM Logo"
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
          </div>

          {/* Copyright and Credits */}
          <div className="text-center space-y-1">
            <p className="text-sm text-white/80" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              © {currentYear} Nathalia Malinowski. Todos os direitos reservados.
            </p>
            <p className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Designed with Canva
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
