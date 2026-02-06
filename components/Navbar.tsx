'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useBrandAsset } from '@/lib/useBrandAsset'
import { useSiteText } from '@/lib/siteText'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  useBrandAsset('navbar')
  const navSobre = useSiteText('nav_sobre', 'Sobre')
  const navServicos = useSiteText('nav_servicos', 'Serviços')
  const navPortfolio = useSiteText('nav_portfolio', 'Portfólio')
  const navGaleria = useSiteText('nav_galeria', 'Galeria')
  const navContato = useSiteText('nav_contato', 'Contato')
  const navToggleLabel = useSiteText('nav_toggle_label', 'Alternar menu')
  const logoSize = {
    width: '72px',
    height: '48px',
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: navSobre, href: '#sobre' },
    { name: navPortfolio, href: '#portfolio' },
    { name: navServicos, href: '#servicos' },
    { name: navGaleria, href: '#galeria' },
    { name: navContato, href: '#contato'}
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)

    const element = document.querySelector(href)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-off-white/75 backdrop-blur-sm shadow-sm' : 'bg-off-white'
      }`}
    >
      <div className="px-6 sm:px-8 ">
        <div className="flex items-center h-16">
          <div className="hidden md:flex flex-1 items-center justify-center justify-between px-20">
            <a href="#hero" className="flex items-center">
              <Image
                  src="/nm-logo-black.png"
                  alt="Nathalia Malinowski"
                  width={20}
                  height={20}
                  className="object-contain w-20 h-20"

              />
            </a>
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-1 py-1 text-[18px] rounded text-graphite transition-colors duration-300 hover:text-off-white hover:bg-olive-green"
                >
                  {item.name}
                </a>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-graphite hover:text-olive-green transition-colors"
            aria-label={navToggleLabel}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-off-white border-t border-warm-beige">
          <div className="px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block py-3 text-sm font-medium text-graphite hover:text-olive-green transition-colors font-sans"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contato"
              onClick={(e) => handleNavClick(e, '#contato')}
              className="block py-3 text-sm font-medium text-olive-green transition-colors font-sans"
            >
              {navContato}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
