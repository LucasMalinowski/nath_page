'use client'

import Link from 'next/link'
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
  return (
    <main className="min-h-screen bg-[#f5f1eb] page-fade-in">
      <Navbar />

      <section className="pt-24">
        <header className="border-b border-[#d9cdb8] px-6 pb-8 sm:px-10 lg:px-16">
          <h1 className="text-center text-4xl font-serif text-[#b89b5e] sm:text-[52px] lg:text-[64px]">
            Serviços
          </h1>
        </header>

        <div className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="mx-auto max-w-6xl space-y-20">
            {services.map((service) => (
              <article
                key={service.title}
                className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-0"
              >
                <div className="lg:pr-16">
                  <h2 className="whitespace-pre-line font-serif text-[28px] leading-[1.02] text-[#6b7a5e] sm:text-[34px]">
                    {service.title}
                  </h2>
                  <div className="mt-10 space-y-6 text-[18px] font-sans leading-[1.02] text-[#735746] sm:text-[19px]">
                    {service.description.map((paragraph) => (
                      <p key={paragraph} className="max-w-[28rem]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="lg:border-l lg:border-[#ece3d5] lg:pl-16">
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
                    <div className="mt-10 flex justify-center lg:justify-end">
                      <Link
                        href={service.cta.href}
                        className="inline-flex items-center justify-center rounded-full border border-[#e3dbd0] bg-white px-8 py-3 text-[16px] font-medium text-[#b0907a] transition-colors hover:bg-[#f0ebe4]"
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
