import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Concept from '@/components/Concept'
import Exhibitors from '@/components/Exhibitors'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import { getBrandExhibitors, getVisiblePortfolioImages } from '@/lib/public-data'
import {
  breadcrumbJsonLd,
  homeFaqJsonLd,
  organizationJsonLd,
  siteUrl,
  websiteJsonLd
} from '@/lib/seo'

export const revalidate = 3600

export default async function Home() {
  const [portfolioProjects, brandExhibitors] = await Promise.all([
    getVisiblePortfolioImages(),
    getBrandExhibitors()
  ])

  return (
    <main className="min-h-screen transition-colors duration-300">
      <JsonLd
        data={[
          organizationJsonLd,
          websiteJsonLd,
          homeFaqJsonLd,
          breadcrumbJsonLd([
            { name: 'Inicio', url: `${siteUrl}/` }
          ])
        ]}
      />
      <Navbar />
      <Hero />
      <Concept />
      <About />
      <Exhibitors initialExhibitors={brandExhibitors} />
      <Portfolio initialProjects={portfolioProjects} />
      <Services />
      <Footer />
    </main>
  )
}
