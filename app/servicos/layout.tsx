import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { baseOpenGraph, defaultOgImage, siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Servicos de Design de Interiores',
  description:
    'Consultoria de interiores, curadoria, pinturas murais autorais e projetos residenciais por Nathalia Malinowski.',
  alternates: {
    canonical: '/servicos'
  },
  openGraph: {
    ...baseOpenGraph,
    title: 'Servicos de Design de Interiores | Nathalia Malinowski',
    description:
      'Conheca os servicos de interiores, curadoria e murais autorais de Nathalia Malinowski.',
    url: `${siteUrl}/servicos`,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'Servicos de design de interiores Nathalia Malinowski'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicos de Design de Interiores | Nathalia Malinowski',
    description:
      'Consultoria, curadoria, murais autorais e projetos residenciais com identidade.',
    images: [defaultOgImage]
  }
}

export default function ServicosLayout({ children }: { children: ReactNode }) {
  return children
}
