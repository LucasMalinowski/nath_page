'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const services = [
  {
    title: 'Consultoria de Interiores e\nCuradoria Virtual',
    description: [
      'Desenvolvimento completo do conceito à definição estética e funcional do espaço.',
      'Cada projeto nasce da escuta atenta e da interpretação da identidade de quem o habita.',
      'É um processo construído em camadas, respeitando contexto, arquitetura e modo de viver.'
    ],
    includes: [
      'Conversa inicial (online ou presencial)',
      'Análise dos ambientes',
      'Moodboard conceitual',
      'Paleta de cores',
      'Direcionamento estético',
      'Curadoria de itens decorativos',
      'Links de compra organizados digitalmente'
    ]
  },
  {
    title: 'Pinturas Murais\nAutorais',
    description: [
      'Criação de intervenções artísticas desenvolvidas a partir do espaço, da arquitetura e da narrativa que o envolve.',
      'Cada mural é único, pensado para dialogar com o ambiente de forma permanente.'
    ],
    includes: [
      'Concepção artística autoral',
      'Estudo de composição e cores',
      'Desenvolvimento do conceito',
      'Execução no local',
      'Materiais artísticos profissionais',
      'Integração estética com o ambiente'
    ]
  },
  {
    title: 'Galeria de Artes e\nCuradoria',
    description: [
      'A Galeria de Artes funciona como um serviço à parte, independente dos serviços de interiores, reunindo obras que dialogam com espaço, tempo e identidade.',
      'As peças estão disponíveis na Galeria sob curadoria e indicações pontuais, podendo ser integradas a projetos, consultorias ou adquiridas sob consulta.'
    ],
    includes: [
      'Curadoria de obras autorais',
      'Seleção de artistas independentes',
      'Arte com significado e propósito',
      'Obras exclusivas',
      'Disponibilidade sob consulta'
    ],
    cta: {
      href: '/galeria',
      label: 'Galeria de Artes'
    }
  }
]

export default function ServicosPage() {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push('/')
  }

  return (
    <main className="min-h-screen bg-[#f5f1eb] page-fade-in">
      <Navbar />

      <section className="pt-24">
        <header className="border-b-[4px] border-[#d9cdb8] px-6 pb-8 sm:px-10 lg:px-16">
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Voltar"
              className="absolute left-0 inline-flex h-11 w-11 items-center justify-center rounded-full text-[#b89b5e] transition-colors hover:bg-[#ece3d5]"
            >
              <ArrowLeft size={24} strokeWidth={1.75} />
            </button>
            <h1 className="text-center text-4xl font-serif text-[#b89b5e] sm:text-[52px] lg:text-[64px]">
              Serviços
            </h1>
          </div>
        </header>

        <div className="px-24 py-12 lg:py-16">
          <div className="space-y-20">
            {services.map((service) => (
              <article
                key={service.title}
                className="grid grid-cols-1 gap-10 lg:min-h-[24rem] lg:grid-cols-2 lg:items-center lg:gap-0"
              >
                <div className="lg:pr-16">
                  <h2 className="whitespace-pre-line font-serif text-[28px] leading-[1.02] text-[#6b7a5e] sm:text-[34px]">
                    {service.title}
                  </h2>
                  <div className="mt-10 space-y-6 text-[18px] font-sans leading-[1.02] text-[#735746] sm:text-[19px]">
                    {service.description.map((paragraph) => (
                      <p key={paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="lg:border-l lg:border-[#ece3d5] lg:pl-24">
                  <h3 className="font-sans text-[16px] font-medium text-[#3b2f26]">Inclui</h3>
                  <ul className="mt-6 space-y-1 text-[16px] font-sans leading-[1.05] text-[#735746] sm:text-[17px]">
                    {service.includes.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="shrink-0 text-[#735746]">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {service.cta && (
                    <div className="mt-10 flex">
                      <Link
                        href={service.cta.href}
                        className="inline-flex items-center justify-center rounded-lg bg-[#4e5f4a] px-8 py-1 text-[16px] text-[#f6f2ed] transition-colors hover:bg-[#f0ebe4]"
                      >
                        {service.cta.label}
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
