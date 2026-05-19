import type { Metadata } from 'next'

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nathalia-malinowski.vercel.app'
export const siteName = 'Nathalia Malinowski'
export const defaultTitle = 'Nathalia Malinowski | Design de Interiores Autoral'
export const defaultDescription =
  'Design de interiores autoral, curadoria e arte para criar espaços com identidade, estética e significado.'
export const defaultOgImage = '/profile-photo.jpeg'

export const baseOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'pt_BR',
  siteName,
  images: [
    {
      url: defaultOgImage,
      width: 1200,
      height: 630,
      alt: 'Nathalia Malinowski Design de Interiores'
    }
  ]
}

export const baseTwitter: Metadata['twitter'] = {
  card: 'summary_large_image',
  title: defaultTitle,
  description: defaultDescription,
  images: [defaultOgImage]
}

export const serviceOfferNames = [
  'Consultoria de interiores',
  'Projeto de interiores residencial',
  'Pinturas murais autorais',
  'Curadoria de artes'
]

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${siteUrl}/#business`,
  name: siteName,
  url: `${siteUrl}/`,
  image: `${siteUrl}${defaultOgImage}`,
  description: defaultDescription,
  areaServed: {
    '@type': 'Country',
    name: 'Brasil'
  },
  founder: {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: 'Nathalia Malinowski',
    jobTitle: 'Designer de interiores e artista plastica',
    url: `${siteUrl}/`
  },
  sameAs: ['https://instagram.com/nathalia_malinowski'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-45-99802-8130',
    contactType: 'customer service',
    availableLanguage: ['Portuguese']
  },
  makesOffer: serviceOfferNames.map((name) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name
    }
  }))
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: siteName,
  inLanguage: 'pt-BR',
  publisher: {
    '@id': `${siteUrl}/#business`
  }
}

export const homeFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quais servicos Nathalia Malinowski oferece?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nathalia Malinowski oferece consultoria de interiores, curadoria, pinturas murais autorais, galeria de artes e projetos residenciais.'
      }
    },
    {
      '@type': 'Question',
      name: 'Como contratar um projeto de interiores?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O contato inicial pode ser feito pelo WhatsApp para alinhamento de escopo, ambiente, estilo, prazo e formato do projeto.'
      }
    }
  ]
}

export const breadcrumbJsonLd = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})
