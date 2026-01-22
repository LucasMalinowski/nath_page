import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nathalia Malinowski - Design de Interiores',
  description: 'Designer de interiores e artista muralista. Transformo ambientes em extensões da personalidade e da história de cada cliente.',
  keywords: ['design de interiores', 'arquitetura', 'decoração', 'murais', 'Nathalia Malinowski'],
  authors: [{ name: 'Nathalia Malinowski' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#c9bda5',
  openGraph: {
    title: 'Nathalia Malinowski - Design de Interiores',
    description: 'Designer de interiores e artista muralista',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}
