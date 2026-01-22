'use client'

import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="relative bg-[#a6a38b]">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
          <Image
            src="/nm-logo.png"
            alt="NM Logo"
            fill
            className="object-contain brightness-0 invert"
            priority
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer
