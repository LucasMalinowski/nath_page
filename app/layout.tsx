import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import './globals.css'
import PageFadeProvider from '@/components/PageFadeProvider'
import PostHogTracker from '@/components/PostHogTracker'
import {
  baseOpenGraph,
  baseTwitter,
  defaultDescription,
  defaultTitle,
  siteName,
  siteUrl
} from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    'design de interiores',
    'designer de interiores',
    'consultoria de interiores',
    'curadoria de artes',
    'murais autorais',
    'projeto residencial',
    'Nathalia Malinowski'
  ],
  authors: [{ name: 'Nathalia Malinowski', url: siteUrl }],
  creator: 'Nathalia Malinowski',
  publisher: siteName,
  alternates: {
    canonical: '/'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  icons: {
    icon: '/nm-gold.png',
    shortcut: '/nm-gold.png',
    apple: '/nm-gold.png'
  },
  openGraph: {
    ...baseOpenGraph,
    url: '/',
    title: defaultTitle,
    description: defaultDescription
  },
  twitter: baseTwitter
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4E5F4A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Suspense fallback={null}>
          <PostHogTracker />
        </Suspense>
        <PageFadeProvider>{children}</PageFadeProvider>
      </body>
    </html>
  )
}
