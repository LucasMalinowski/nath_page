'use client'

import Image from 'next/image'
import { useBrandAsset } from '@/lib/useBrandAsset'

const Footer = () => {
  const brandAsset = useBrandAsset('footer')
  const logoSize = {
    width: `${brandAsset?.width_px ?? 64}px`,
    height: `${brandAsset?.height_px ?? 64}px`,
  }

  return (
    <footer className="relative bg-olive-green py-2">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Logo */}
          <div className="relative" style={logoSize}>
            <Image
              src={brandAsset?.image_url || '/nm-logo.png'}
              alt={brandAsset?.title || 'NM Logo'}
              fill
              className="object-contain brightness-0 invert"
              priority
              unoptimized
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
