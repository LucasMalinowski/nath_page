'use client'

import Image from 'next/image'
import { useBrandAsset } from '@/lib/useBrandAsset'
import { useSiteText } from '@/lib/siteText'

const Footer = () => {
  const brandAsset = useBrandAsset('footer')
  const footerCopyright = useSiteText(
    'footer_copyright',
    '© {year} Nathalia Malinowski. Todos os direitos reservados.'
  )
  const footerTagline = useSiteText('footer_tagline', 'Camadas do Tempo | Clássico Vivo')
  const logoSize = {
    width: `${brandAsset?.width_px ?? 64}px`,
    height: `${brandAsset?.height_px ?? 64}px`,
  }
  const year = new Date().getFullYear()
  const copyright = footerCopyright.replace('{year}', String(year))

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
            {copyright}
          </p>

          {/* Tagline */}
          <p className="text-sm font-serif italic text-off-white/70 text-center">
            {footerTagline}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
