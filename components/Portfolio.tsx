'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import Typewriter from '@/components/Typewriter'
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
        return
      }

      if (event.key === 'ArrowLeft') {
        setActiveImageIndex((currentIndex) =>
          currentIndex === 0 ? activeProject.galleryImages.length - 1 : currentIndex - 1
        )
        return
      }

      if (event.key === 'ArrowRight') {
        setActiveImageIndex((currentIndex) =>
          currentIndex === activeProject.galleryImages.length - 1 ? 0 : currentIndex + 1
        )
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

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? activeImages.length - 1 : currentIndex - 1
    )
  }

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === activeImages.length - 1 ? 0 : currentIndex + 1
    )
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
      <section id="portfolio" className="bg-[#f5f1eb] pb-20 border-b-2 border-[#d9cdb8]/20 mt-4">
        <header className="md:text-center py-24 mb-2 px-6 sm:px-8 md:px-20">
          <h2 className="text-h2-mobile md:text-5xl  font-serif font-normal text-[#c8aa6a]">{portfolioTitle}</h2>
          <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl mt-5 italic font-poetic text-text/60">{portfolioSubtitle}</p>
        </header>
        <div className="px-6 sm:px-8 md:px-20">

          <div className="mt-14 space-y-16 md:space-y-20">
            {projects.map((project, index) => {
              const imageLeft = index % 2 === 0
              const isTallFrame = index % 2 === 0
              return (
                <article
                  key={project.id}
                  className={`grid grid-cols-1 items-stretch gap-8 md:gap-12 ${
                    imageLeft
                      ? isTallFrame
                        ? 'md:grid-cols-[minmax(0,420px)_minmax(0,1fr)]'
                        : 'md:grid-cols-[minmax(0,520px)_minmax(0,1fr)]'
                      : isTallFrame
                        ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]'
                        : 'md:grid-cols-[minmax(0,1fr)_minmax(0,520px)]'
                  }`}
                >
                  <div
                    className={`order-1 ${imageLeft ? 'md:order-1 md:justify-self-start' : 'md:order-2 md:justify-self-end'} w-full`}
                  >
                    {project.coverImage ? (
                      <div
                        className={`relative overflow-hidden bg-[#ede7de] ${
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
                        <div className="absolute inset-0 bg-gradient-to-t from-[#3b2f26]/14 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <div
                        className={`bg-[#ede7de] ${
                          isTallFrame
                            ? 'aspect-[4/5] max-w-[360px] sm:max-w-[390px] md:max-w-[420px]'
                            : 'aspect-[16/10] max-w-[460px] sm:max-w-[520px]'
                        }`}
                      />
                    )}
                  </div>

                  <div
                    className={`order-2 ${imageLeft ? 'md:order-2' : 'md:order-1'} flex h-full w-full flex-col py-4`}
                  >
                    <div className="max-w-[540px] mb-4">
                      <span className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B89B5E] mb-5 block">
                        {String(index + 1).padStart(2, '0')} —
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-text leading-[1.2]">{project.title}</h3>
                      <div className="w-6 h-[1.5px] bg-[#B89B5E] my-[16px] opacity-60" />
                      {project.description && (
                        <p className="whitespace-pre-line text-[15px] md:text-lg leading-[1.8] font-sans font-light text-[#735746]">
                          {project.description}
                        </p>
                      )}
                    </div>
                    {project.phrase && (
                      <blockquote className="mt-auto font-poetic italic text-[20px] text-[#9f8a74] leading-[1.5]">
                        <Typewriter
                          text={`"${project.phrase}"`}
                          classes="text-[#9f8a74]"
                        />
                      </blockquote>
                    )}

                    <button
                      type="button"
                      onClick={() => openProjectModal(project)}
                      className={`${!project.phrase ? 'mt-auto' : 'mt-5'} inline-flex items-center gap-2 rounded-[4px] bg-[#B89B5E] px-[22px] py-[7px] text-[12px] font-medium tracking-[0.1em] uppercase text-[#f5f1eb] transition-all hover:-translate-y-0.5 hover:bg-[#a58a51] ${
                        imageLeft ? 'self-center md:self-end' : 'self-center md:self-start'
                      }`}
                    >
                      Ver projeto
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
            <div className="relative my-4 flex w-full max-w-2xl flex-col overflow-y-auto rounded-md bg-[#f5f1eb] p-4 shadow-2xl max-h-[calc(100vh-2rem)] md:my-auto md:max-w-5xl md:max-h-[calc(100vh-4rem)] md:p-8">
            <button
              type="button"
              onClick={closeProjectModal}
              className="absolute right-3 top-3 rounded-full border border-[#d8c7ae] p-2 text-text/80 transition-colors hover:bg-[#ece3d8]"
              aria-label="Fechar modal"
            >
              <X size={18} />
            </button>

            <h3 className="pr-10 text-xl font-serif text-text md:text-3xl">{activeProject.title}</h3>

              <div className="mt-4 md:mt-6 md:flex-1 md:overflow-y-auto pr-1">
                {activeImages.length > 0 && (
                  <>
                    <div className="relative h-[220px] overflow-hidden border border-[#e2d5c2] bg-[#ece4d8] md:h-[520px]">
                      <Image
                        src={activeImages[activeImageIndex]}
                        alt={`${activeProject.title} - foto ${activeImageIndex + 1}`}
                        fill
                        className="object-contain"
                        unoptimized
                      />

                      {activeImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={showPreviousImage}
                            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#f5f1eb]/90 text-[#735746] shadow-md transition-colors hover:bg-[#f5f1eb]"
                            aria-label="Imagem anterior"
                          >
                            <ArrowLeft size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={showNextImage}
                            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#f5f1eb]/90 text-[#735746] shadow-md transition-colors hover:bg-[#f5f1eb]"
                            aria-label="Próxima imagem"
                          >
                            <ArrowRight size={18} />
                          </button>

                          <div className="absolute bottom-3 right-3 rounded-full bg-[#f5f1eb]/90 px-3 py-1 text-sm text-[#735746] shadow-sm">
                            {activeImageIndex + 1}/{activeImages.length}
                          </div>
                        </>
                      )}
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
