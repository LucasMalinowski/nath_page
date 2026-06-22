import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { baseOpenGraph, defaultOgImage, siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Serviços de Design de Interiores Autoral',
  description:
    'Projeto residencial, consultoria, curadoria, pinturas murais autorais e galeria de artes. Espaços com identidade, estética e significado.',
  alternates: {
    canonical: '/servicos'
  },
  openGraph: {
    ...baseOpenGraph,
    title: 'Serviços | Nathalia Malinowski - Design de Interiores Autoral',
    description:
      'Projetos pensados a partir da sua história, da sua rotina e da atmosfera que você deseja viver.',
    url: `${siteUrl}/servicos`,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'Serviços de design de interiores autoral - Nathalia Malinowski'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serviços | Nathalia Malinowski - Design de Interiores Autoral',
    description:
      'Projeto residencial, consultoria, curadoria, murais autorais e galeria de artes com identidade e significado.',
    images: [defaultOgImage]
  }
}

export default function ServicosLayout({ children }: { children: ReactNode }) {
  return children
}
