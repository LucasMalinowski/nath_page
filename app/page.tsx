import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Concept from '@/components/Concept'
import Exhibitors from '@/components/Exhibitors'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen transition-colors duration-300">
      <Navbar />
      <Hero />
      <Concept />
      <About />
      <Exhibitors />
      <Portfolio />
      <Services />
      <Footer />
    </main>
  )
}
