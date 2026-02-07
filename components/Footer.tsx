'use client'

import Image from 'next/image'
import { useBrandAsset } from '@/lib/useBrandAsset'

const Footer = () => {
  const brandAsset = useBrandAsset('footer')
  const logoSize = {
    width: `${brandAsset?.width_px ?? 72}px`,
    height: `${brandAsset?.height_px ?? 72}px`,
  }

  return (
    <footer className="bg-moss border-t border-bg/30 py-4">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 flex justify-center">
        <div className="relative" style={logoSize}>
          <Image
            src={brandAsset?.image_url || '/nm-logo-white.png'}
            alt={brandAsset?.title || 'NM Logo'}
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer
