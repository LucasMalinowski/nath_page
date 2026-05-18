import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import JsonLd from '@/components/JsonLd'
import { getGalleryProducts } from '@/lib/public-data'
import { baseOpenGraph, defaultOgImage, siteUrl } from '@/lib/seo'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Galeria de Artes e Curadoria',
  description:
    'Galeria de artes, obras autorais e curadoria de pecas selecionadas por Nathalia Malinowski para interiores com identidade.',
  alternates: {
    canonical: '/galeria'
  },
  openGraph: {
    ...baseOpenGraph,
    title: 'Galeria de Artes e Curadoria | Nathalia Malinowski',
    description:
      'Obras autorais e pecas selecionadas para dialogar com interiores, tempo e identidade.',
    url: `${siteUrl}/galeria`,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'Galeria de artes Nathalia Malinowski'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galeria de Artes e Curadoria | Nathalia Malinowski',
    description:
      'Obras autorais e curadoria de pecas selecionadas para interiores com identidade.',
    images: [defaultOgImage]
  }
}

const parseImages = (item: { images?: string | string[] | null }): string[] => {
  if (!item.images) return []
  if (Array.isArray(item.images)) return item.images.filter(Boolean)
  try {
    const parsed = JSON.parse(item.images)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

export default async function GaleriaLayout({ children }: { children: ReactNode }) {
  const products = await getGalleryProducts()
  const productItemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteUrl}/galeria#products`,
    name: 'Obras disponiveis na Galeria Nathalia Malinowski',
    itemListElement: products.slice(0, 24).map((product, index) => {
      const images = parseImages(product)

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          description: product.description || undefined,
          image: images[0] || undefined,
          brand: {
            '@type': 'Brand',
            name: product.author || 'Nathalia Malinowski'
          },
          offers: product.price_text
            ? {
                '@type': 'Offer',
                priceCurrency: 'BRL',
                price: product.price_text.replace(/\./g, '').replace(',', '.'),
                availability: 'https://schema.org/InStock',
                url: `${siteUrl}/galeria`
              }
            : undefined
        }
      }
    })
  }

  return (
    <>
      {products.length > 0 && <JsonLd data={productItemListJsonLd} />}
      {children}
    </>
  )
}
