import type { Metadata } from 'next'
import { Libre_Baskerville, Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import SiteMediaProvider from '@/components/SiteMediaProvider'
import { SiteTextProvider } from '@/lib/siteText'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-title',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-poetic',
})

export const metadata: Metadata = {
  title: 'Nathalia Malinowski | Design de Interiores',
  description:
    'Projetos autorais que unem estética, história e funcionalidade, com curadoria e direção criativa para espaços com identidade.',
  keywords: ['design de interiores', 'arquitetura', 'decoração', 'murais', 'Nathalia Malinowski', 'projetos autorais', 'design atemporal'],
  authors: [{ name: 'Nathalia Malinowski' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#4E5F4A',
  openGraph: {
    title: 'Nathalia Malinowski | Design de Interiores',
    description: 'Projetos autorais que unem estética, história e funcionalidade.',
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
      <body className={`${libreBaskerville.variable} ${inter.variable} ${cormorant.variable}`}>
        <SiteTextProvider>
          <SiteMediaProvider>{children}</SiteMediaProvider>
        </SiteTextProvider>
      </body>
    </html>
  )
}
