import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Concept from '@/components/Concept'
import About from '@/components/About'
import Portfolio from '@/components/Portfolio'
import Services from '@/components/Services'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <Navbar />
      <Hero />
      <Concept />
      <About />
      <Portfolio />
      <Services />
      <Contact />
      <Footer />
    </main>
  )
}
