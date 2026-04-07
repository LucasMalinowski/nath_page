'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { supabase, GalleryExhibitor } from '@/lib/supabase'

const sectionTitle = 'Quem constrói a marca'
const sectionSubtitle = 'A marca se constrói no encontro entre direção criativa, técnica e expressão'

const Exhibitors = () => {
  const [exhibitors, setExhibitors] = useState<GalleryExhibitor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetchExhibitors()
  }, [])

  const fetchExhibitors = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_exhibitors')
        .select('*')
        .eq('is_visible', true)
        .eq('brand_member', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      setExhibitors(data || [])
    } catch (error) {
      console.error('Error fetching exhibitors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!loading && exhibitors.length === 0) {
    return null
  }

  return (
    <section id="expositores" className="relative bg-[#f5f1eb] py-16 md:py-24 border-b-2 border-[#d9cdb8]/20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-16">
        <header className="text-center">
          <h2 className="text-5xl md:text-6xl font-serif font-normal text-[#c8aa6a]">
            {sectionTitle}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl mt-5 italic font-poetic text-text/60">
            {sectionSubtitle}
          </p>
        </header>

        <div className="mt-14 space-y-8 md:mt-16 md:space-y-10">
          {loading
            ? [0, 1].map((item) => (
                <div
                  key={item}
                  className="grid min-h-[240px] animate-pulse grid-cols-1 overflow-hidden bg-[#eee9e2] md:grid-cols-[180px_minmax(0,1fr)]"
                >
                  <div className="bg-[#d8ccbb]" />
                  <div className="p-8 md:p-10" />
                </div>
              ))
            : exhibitors.map((exhibitor) => {
                const instagramHref = exhibitor.instagram_path
                  ? `https://instagram.com/${exhibitor.instagram_path.replace(/^@/, '')}`
                  : null

                return (
                  <article
                    key={exhibitor.id}
                    className="grid bg-[#eee9e2] md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]"
                  >
                    <div className="p-5 md:p-6">
                      <div className="relative aspect-[4/4.8] bg-[#ddd2c4]">
                        {exhibitor.avatar_url && (
                          <Image
                            src={exhibitor.avatar_url}
                            alt={exhibitor.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center px-6 py-7 md:px-10 md:py-8 lg:px-12">
                      <h3 className="text-2xl font-serif font-normal text-text">
                        {exhibitor.name}
                      </h3>

                      {exhibitor.title && (
                        <p className="mt-4 text-base font-normal text-[#735746] md:text-lg">
                          {exhibitor.title}
                        </p>
                      )}

                      {exhibitor.description && (
                        <p className="mt-2 max-w-3xl whitespace-pre-line text-base leading-snug text-[#735746] md:text-[1.05rem]">
                          {exhibitor.description}
                        </p>
                      )}

                      {instagramHref && (
                        <Link
                          href={instagramHref}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex items-center gap-2 text-sm text-[#735746]/80 transition-colors hover:text-[#9f8450] md:text-base"
                        >
                          <Instagram size={16} className="text-[#b89b5e]"/>
                          {exhibitor.instagram_path}
                        </Link>
                      )}
                    </div>
                  </article>
                )
              })}
        </div>
      </div>
    </section>
  )
}

export default Exhibitors
