'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, X } from 'lucide-react'
import { supabase, PortfolioImage } from '@/lib/supabase'

type PortfolioProject = PortfolioImage & {
  galleryImages: string[]
  coverImage: string
}

const parseImages = (item: PortfolioImage): string[] => {
  if (item.images) {
    if (Array.isArray(item.images)) return item.images.filter(Boolean)
    if (typeof item.images === 'string') {
      try {
        const parsed = JSON.parse(item.images)
        if (Array.isArray(parsed)) {
          return parsed.filter((url): url is string => typeof url === 'string' && Boolean(url))
        }
      } catch (error) {
        console.warn('Failed to parse portfolio images JSON', error)
      }
    }
  }
  return item.image_url ? [item.image_url] : []
}

const Portfolio = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const portfolioTitle = 'Portfólio'
  const portfolioSubtitle = 'Projetos que traduzem histórias, identidades e modos de viver'
  const portfolioLoading = 'Carregando...'
  const portfolioEmpty = 'Em breve, novos projetos serão adicionados'

  useEffect(() => {
    void fetchPortfolioImages()
  }, [])

  useEffect(() => {
    if (!activeProject) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveProject(null)
        setActiveImageIndex(0)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [activeProject])

  const fetchPortfolioImages = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true })

      if (error) throw error

      const mappedProjects: PortfolioProject[] = (data || []).map((item) => {
        const parsedImages = parseImages(item)
        const coverImage = item.cover_url || item.image_url || parsedImages[0] || ''

        const galleryImages = [coverImage, ...parsedImages].filter(
          (url, index, array) => Boolean(url) && array.indexOf(url) === index
        )

        return {
          ...item,
          coverImage,
          galleryImages
        }
      })

      setProjects(mappedProjects)
    } catch (error) {
      console.error('Error fetching portfolio images:', error)
    } finally {
      setLoading(false)
    }
  }

  const activeImages = useMemo(() => {
    if (!activeProject) return []
    return activeProject.galleryImages
  }, [activeProject])

  const openProjectModal = (project: PortfolioProject) => {
    setActiveProject(project)
    setActiveImageIndex(0)
  }

  const closeProjectModal = () => {
    setActiveProject(null)
    setActiveImageIndex(0)
  }

  if (loading) {
    return (
      <section id="portfolio" className="bg-[#f5f1eb] py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-16">
          <header className="text-center">
            <h2 className="text-5xl md:text-6xl font-serif font-normal text-[#b89b5e]">{portfolioTitle}</h2>
            <p className="mt-6 text-lg text-text/70">{portfolioLoading}</p>
          </header>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section id="portfolio" className="bg-[#f5f1eb] py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-16">
          <header className="text-center">
            <h2 className="text-5xl md:text-6xl font-serif font-normal text-[#b89b5e]">{portfolioTitle}</h2>
            <p className="mt-6 text-lg text-text/70">{portfolioEmpty}</p>
          </header>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="portfolio" className="bg-[#f5f1eb] py-20 border-b-2 border-[#d9cdb8]/20">
          <header className="text-center border-b-[4px] pb-14 border-[#e3d8c8]">
            <h2 className="text-5xl md:text-6xl font-serif font-normal text-[#b89b5e]">{portfolioTitle}</h2>
            <p className="mt-6 text-lg text-text/70">{portfolioSubtitle}</p>
          </header>
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-16">

          <div className="mt-14 space-y-16 md:space-y-20">
            {projects.map((project, index) => {
              const imageLeft = index % 2 === 0
              const isTallFrame = index % 2 === 0
              return (
                <article
                  key={project.id}
                  className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 md:gap-12"
                >
                  <div
                    className={`${imageLeft ? 'order-1 md:order-1' : 'order-2 md:order-2'} ${
                      imageLeft ? 'md:justify-self-start' : 'md:justify-self-end'
                    } w-full`}
                  >
                    {project.coverImage ? (
                      <div
                        className={`relative overflow-hidden border border-[#e3d8c8] bg-[#ede7de] ${
                          isTallFrame
                            ? 'aspect-[4/5] max-w-[360px] sm:max-w-[390px] md:max-w-[420px]'
                            : 'aspect-[16/10] max-w-[460px] sm:max-w-[520px]'
                        }`}
                      >
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div
                        className={`border border-[#e3d8c8] bg-[#ede7de] ${
                          isTallFrame
                            ? 'aspect-[4/5] max-w-[360px] sm:max-w-[390px] md:max-w-[420px]'
                            : 'aspect-[16/10] max-w-[460px] sm:max-w-[520px]'
                        }`}
                      />
                    )}
                  </div>

                  <div
                    className={`${imageLeft ? 'order-2 md:order-2' : 'order-1 md:order-1'} flex h-full w-full max-w-[540px] flex-col py-10`}
                  >
                    <h3 className="text-3xl font-serif text-text">{project.title}</h3>
                    {project.description && (
                      <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-text/75">
                        {project.description}
                      </p>
                    )}
                    {project.phrase && (
                      <p className="mt-5 border-l-2 border-[#735746]/40 pl-4 py-2 whitespace-pre-line text-xl font-thin italic leading-snug text-[#9f876c]">
                        {project.phrase}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => openProjectModal(project)}
                      className={`mt-auto inline-flex items-center gap-2 rounded-md bg-[#c3a35a] px-12 py-1.5 text-sm text-[#f5f1eb] transition-colors hover:bg-[#b59347] ${
                        imageLeft ? 'self-end' : 'self-start'
                      }`}
                    >
                      Ver projeto
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {activeProject && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#20160f]/70 px-4 py-4 md:py-8">
          <div className="flex min-h-full items-start justify-center">
            <div className="relative my-auto flex w-full max-w-5xl max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-md bg-[#f5f1eb] p-5 shadow-2xl md:max-h-[calc(100vh-4rem)] md:p-8">
            <button
              type="button"
              onClick={closeProjectModal}
              className="absolute right-3 top-3 rounded-full border border-[#d8c7ae] p-2 text-text/80 transition-colors hover:bg-[#ece3d8]"
              aria-label="Fechar modal"
            >
              <X size={18} />
            </button>

            <h3 className="pr-10 text-2xl font-serif text-text md:text-3xl">{activeProject.title}</h3>

              <div className="mt-6 flex-1 overflow-y-auto pr-1">
                {activeImages.length > 0 && (
                  <>
                    <div className="relative h-[300px] overflow-hidden border border-[#e2d5c2] bg-[#ece4d8] md:h-[520px]">
                      <Image
                        src={activeImages[activeImageIndex]}
                        alt={`${activeProject.title} - foto ${activeImageIndex + 1}`}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    {activeImages.length > 1 && (
                      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                        {activeImages.map((image, index) => (
                          <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => setActiveImageIndex(index)}
                            className={`relative h-20 w-24 shrink-0 overflow-hidden border transition-colors ${
                              index === activeImageIndex ? 'border-[#b89b5e]' : 'border-[#d5c5ad]'
                            }`}
                            aria-label={`Abrir foto ${index + 1}`}
                          >
                            <Image
                              src={image}
                              alt={`${activeProject.title} miniatura ${index + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Portfolio
