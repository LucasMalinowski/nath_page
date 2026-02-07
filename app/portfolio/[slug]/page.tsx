'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { portfolioProjects } from '@/lib/content'

export default function PortfolioProjectPage() {
  const params = useParams<{ slug: string }>()
  const project = useMemo(() => portfolioProjects.find((item) => item.slug === params.slug), [params.slug])
  const [index, setIndex] = useState(0)

  if (!project) {
    return (
      <main className="min-h-screen bg-bg text-text flex flex-col items-center justify-center gap-4">
        <p>Projeto não encontrado.</p>
        <Link href="/#portfolio" className="px-4 py-2 bg-olive text-bg rounded-card">Voltar ao portfólio</Link>
      </main>
    )
  }

  const nextSlide = () => setIndex((current) => (current + 1) % project.images.length)
  const prevSlide = () => setIndex((current) => (current - 1 + project.images.length) % project.images.length)

  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 py-12 animate-[fadeIn_0.4s_ease-out]">
        <Link
          href="/#portfolio"
          className="inline-flex items-center gap-2 text-body text-olive hover:text-moss transition-colors mb-8"
        >
          <ArrowLeft size={18} /> Voltar
        </Link>

        <header className="mb-8">
          <h1 className="text-h1-mobile md:text-h1 text-gold">{project.title}</h1>
          <p className="text-body-mobile md:text-body mt-3 max-w-3xl">{project.shortDescription}</p>
          {project.concept ? <p className="poetic text-3xl text-moss mt-4">{project.concept}</p> : null}
        </header>

        <div className="relative aspect-[16/10] rounded-card overflow-hidden border border-border bg-surface shadow-soft">
          <Image src={project.images[index]} alt={`TODO: Add photo for ${project.title} (${index + 1}/${project.images.length})`} fill className="object-cover" />
          <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-bg/90" aria-label="Imagem anterior">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-bg/90" aria-label="Próxima imagem">
            <ChevronRight size={20} />
          </button>
          <span className="absolute right-3 bottom-3 text-small bg-text/70 text-bg rounded px-2 py-1">
            {index + 1}/{project.images.length}
          </span>
        </div>
      </div>
    </main>
  )
}
