'use client'

import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="relative bg-olive-green py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Logo */}
          <div className="relative w-16 h-16">
            <Image
              src="/nm-logo.png"
              alt="NM Logo"
              fill
              className="object-contain brightness-0 invert"
              priority
            />
          </div>

          {/* Copyright */}
          <p className="text-sm font-sans text-off-white/80 text-center">
            © {new Date().getFullYear()} Nathalia Malinowski. Todos os direitos reservados.
          </p>

          {/* Tagline */}
          <p className="text-sm font-serif italic text-off-white/70 text-center">
            Camadas do Tempo | Clássico Vivo
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
