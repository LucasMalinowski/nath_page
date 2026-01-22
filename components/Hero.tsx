'use client'

import Image from 'next/image'

const Hero = () => {
  return (
      <section id="hero" className="relative pt-14 pb-8 bg-[#ebeae0]">
        {/* Video Container with larger side padding and reduced height */}
        <div className="w-full px-10 md:px-16 lg:px-28">
          <div className="relative w-full overflow-hidden" style={{ paddingBottom: '50%' }}>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Content Overlay on Video */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-6">
                {/* NM Logo Image */}
                <div className="mb-4 animate-fade-in flex justify-center">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                    <Image
                        src="/nm-logo.png"
                        alt="NM Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                  </div>
                </div>

                {/* Name and Title */}
                <div className="animate-fade-in delay-200">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Nathalia Malinowski
                  </h2>
                  <p className="text-xs md:text-sm tracking-widest font-light" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Design de Interiores
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Hero