export type PortfolioProject = {
  id: string
  slug: string
  title: string
  subtitle?: string
  shortDescription: string
  concept?: string
  tags: string[]
  coverImage: string
  images: string[]
  year?: string
  location?: string
}

export type GalleryProduct = {
  id: string
  slug: string
  title: string
  artistName: string
  artistInstagram?: string
  description: string
  priceCents: number
  currency: 'BRL'
  images: string[]
  dimensions?: string
  medium?: string
  inStock: boolean
}

export type Exhibitor = {
  id: string
  name: string
  role: string
  photo: string
  instagram?: string
  quote?: string
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'p1',
    slug: 'recepcao-sante',
    title: 'Recepção Santé Sistemas',
    shortDescription: 'Pensada em juntar o poder da arte com a complexidade da tecnologia.',
    concept: 'TODO: Add photo for Recepção Santé Sistemas (5–12 imagens do projeto).',
    tags: ['Corporativo', 'Mural Autoral'],
    coverImage: '/nm-logo-green.png',
    images: ['/nm-logo-green.png', '/nathalia-green.png', '/nm-nathalia-green.png'],
    year: '2024',
    location: 'Cascavel/PR',
  },
  {
    id: 'p2',
    slug: 'quarto-do-efraim',
    title: 'Quarto do Efraim',
    shortDescription: 'A aventura de viver. Simbolizando o poder de sonhar e possibilidades para conquistar.',
    concept: 'TODO: Add photo for Quarto do Efraim (5–12 imagens do projeto).',
    tags: ['Residencial', 'Infantil'],
    coverImage: '/nm-logo-black.png',
    images: ['/nm-logo-black.png', '/nathalia-black.png', '/nm-nathalia-black.png'],
    year: '2024',
    location: 'Toledo/PR',
  },
  {
    id: 'p3',
    slug: 'sala-de-jantar-da-edna',
    title: 'Sala de Jantar da Edna',
    shortDescription: 'Reforma completa. O poder de trazer um novo significado para o que já existe.',
    concept: 'TODO: Add photo for Sala de Jantar da Edna (5–12 imagens do projeto).',
    tags: ['Residencial', 'Reforma'],
    coverImage: '/nm-logo.png',
    images: ['/nm-logo.png', '/nathalia-white.png', '/nm-nathalia-white.png'],
    year: '2023',
    location: 'Marechal Cândido Rondon/PR',
  },
  {
    id: 'p4',
    slug: 'corredor-ala-voluntarios',
    title: 'Corredor ala de voluntários',
    shortDescription: 'Um corredor inteiro pensado em trazer o movimento do pulsar do coração de Deus pelo Servir.',
    concept: 'TODO: Add photo for Corredor ala de voluntários (5–12 imagens do projeto).',
    tags: ['Institucional', 'Mural'],
    coverImage: '/nm-logo-white.png',
    images: ['/nm-logo-white.png', '/nathalia-green.png', '/nm-nathalia-green.png'],
    year: '2022',
    location: 'Cascavel/PR',
  },
]

export const galleryProducts: GalleryProduct[] = [
  {
    id: 'g1',
    slug: 'uma-danca-de-vida',
    title: 'Uma dança de vida.',
    artistName: 'Nathalia Malinowski',
    artistInstagram: 'nathalia_malinowski',
    description: 'Arte criada para representar uma oração profunda e sincera: “Deus, me ensina a viver, me ensina!”. TODO: Add photo for Uma dança de vida.',
    priceCents: 25000,
    currency: 'BRL',
    images: ['/nm-logo-green.png', '/nm-logo-black.png', '/nm-logo-white.png'],
    dimensions: '40x50 cm',
    medium: 'Acrílica sobre tela',
    inStock: true,
  },
  {
    id: 'g2',
    slug: 'camadas-de-fe',
    title: 'Camadas de fé.',
    artistName: 'Nathalia Malinowski',
    description: 'Curadoria de peça autoral para espaços com memória e presença. TODO: Add photo for Camadas de fé.',
    priceCents: 25000,
    currency: 'BRL',
    images: ['/nm-logo.png', '/nathalia-black.png', '/nathalia-white.png'],
    dimensions: '50x70 cm',
    medium: 'Técnica mista',
    inStock: true,
  },
  {
    id: 'g3',
    slug: 'sopro-de-casa',
    title: 'Sopro de casa.',
    artistName: 'Artista convidada',
    artistInstagram: 'raioubordados_',
    description: 'Peça selecionada para dialogar com o espaço, o tempo e a identidade de quem habita. TODO: Add photo for Sopro de casa.',
    priceCents: 25000,
    currency: 'BRL',
    images: ['/nm-nathalia-green.png', '/nm-nathalia-black.png', '/nm-nathalia-white.png'],
    dimensions: '35x45 cm',
    medium: 'Bordado autoral',
    inStock: true,
  },
]

export const exhibitors: Exhibitor[] = [
  {
    id: 'e1',
    name: 'Nathalia Malinowski',
    role: 'Designer de Interiores e proprietária da Galeria.',
    photo: '/profile-photo.jpeg',
    instagram: 'nathalia_malinowski',
    quote: 'Nossa arte tem o propósito de trazer vida para o que chamamos de lar...',
  },
  {
    id: 'e2',
    name: 'Rafaela Ulkoski | Raiou Bordados',
    role: 'Designer de Interiores e fundadora da empresa Raiou Bordados.',
    photo: '/nm-logo-green.png',
    instagram: 'raioubordados_',
    quote: 'TODO: Add photo for Rafaela Ulkoski / Raiou Bordados.',
  },
]

export const formatPrice = (priceCents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceCents / 100)
