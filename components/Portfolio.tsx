'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { portfolioProjects } from '@/lib/content'
import { useSiteText } from '@/lib/siteText'

const ProjectCard = ({
  title,
  shortDescription,
  images,
  slug,
}: {
  title: string
  shortDescription: string
  images: string[]
  slug: string
}) => {
  const [index, setIndex] = useState(0)

  const nextSlide = () => setIndex((current) => (current + 1) % images.length)
  const prevSlide = () => setIndex((current) => (current - 1 + images.length) % images.length)

  return (
    <article className="rounded-card border border-border bg-surface p-4 shadow-soft">
      <div className="relative aspect-[4/3] rounded-card overflow-hidden border border-border bg-bg">
        <Image src={images[index]} alt={`TODO: Add photo for ${title} (${index + 1}/${images.length})`} fill className="object-cover" />
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-bg/80"
          aria-label="Imagem anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-bg/80"
          aria-label="Próxima imagem"
        >
          <ChevronRight size={18} />
        </button>
        <span className="absolute bottom-2 right-2 text-small bg-text/70 text-bg px-2 py-1 rounded">{index + 1}/{images.length}</span>
      </div>

      <h3 className="text-h3-mobile md:text-h3 mt-4 text-text">{title}</h3>
      <p className="text-body-mobile md:text-body text-text/85 mt-2">{shortDescription}</p>

      <Link
        href={`/portfolio/${slug}`}
        className="inline-block mt-4 text-small md:text-body text-olive font-medium hover:text-moss transition-colors"
      >
        Ver projeto completo →
      </Link>
    </article>
  )
}

const Portfolio = () => {
  const portfolioTitle = useSiteText('portfolio_title', 'Portfólio')
  const portfolioSubtitle = useSiteText(
    'portfolio_subtitle',
    'Meus serviços acompanham diferentes momentos, sempre com um olhar autoral, sensível e estruturado.'
  )

  return (
    <section id="portfolio" className="py-section bg-moss text-bg paper-texture">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
          <h2 className="text-h1-mobile md:text-h1 text-mustard">{portfolioTitle}</h2>
          <p className="max-w-xl text-h3-mobile md:text-h3 text-bg/90">{portfolioSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 text-text">
          {portfolioProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              shortDescription={project.shortDescription}
              images={project.images}
              slug={project.slug}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
