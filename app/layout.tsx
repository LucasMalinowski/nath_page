import type { Metadata } from 'next'
import './globals.css'
import SiteMediaProvider from '@/components/SiteMediaProvider'
import { SiteTextProvider } from '@/lib/siteText'

export const metadata: Metadata = {
  title: 'Nathalia Malinowski | Design de Interiores',
  description: 'Design de interiores com história, sensibilidade e identidade. Projetos autorais que unem o clássico ao vivido, criando espaços atemporais, afetivos e cheios de significado.',
  keywords: ['design de interiores', 'arquitetura', 'decoração', 'murais', 'Nathalia Malinowski', 'projetos autorais', 'design atemporal'],
  authors: [{ name: 'Nathalia Malinowski' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#5E6F64',
  openGraph: {
    title: 'Nathalia Malinowski | Design de Interiores',
    description: 'Design de interiores com história, sensibilidade e identidade',
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
        <SiteTextProvider>
          <SiteMediaProvider>{children}</SiteMediaProvider>
        </SiteTextProvider>
      </body>
    </html>
  )
}
