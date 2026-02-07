'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useBrandAsset } from '@/lib/useBrandAsset'
import { useSiteText } from '@/lib/siteText'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const brandAsset = useBrandAsset('navbar')

  const navSobre = useSiteText('nav_sobre', 'Sobre')
  const navPortfolio = useSiteText('nav_portfolio', 'Portfólio')
  const navServicos = useSiteText('nav_servicos', 'Serviços')
  const navGaleria = useSiteText('nav_galeria', 'Galeria')
  const navContato = useSiteText('nav_contato', 'Contato')
  const navToggleLabel = useSiteText('nav_toggle_label', 'Alternar menu')

  const logoSize = {
    width: `${brandAsset?.width_px ?? 84}px`,
    height: `${brandAsset?.height_px ?? 52}px`,
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToAnchor = (href: string) => {
    const element = document.querySelector(href)
    if (!element) return
    const offset = 88
    const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }

  const navItems = [
    { name: navSobre, href: '#sobre' },
    { name: navPortfolio, href: '#portfolio' },
    { name: navServicos, href: '#servicos' },
  ]

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b border-border transition-all duration-300 ${
        isScrolled ? 'bg-bg/95 backdrop-blur-sm' : 'bg-bg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="flex items-center justify-between h-20">
          <a href="#hero" className="flex items-center" aria-label="Início">
            <div className="relative" style={logoSize}>
              <Image
                src={brandAsset?.image_url || '/nm-logo.png'}
                alt={brandAsset?.title || 'Nathalia Malinowski'}
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </a>

          <div className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault()
                  scrollToAnchor(item.href)
                }}
                className="text-body font-medium text-text hover:text-olive transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a href="/galeria" className="text-body font-medium text-text hover:text-olive transition-colors">
              {navGaleria}
            </a>
            <a
              href="#contato"
              onClick={(event) => {
                event.preventDefault()
                scrollToAnchor('#contato')
              }}
              className="px-5 py-2 rounded-card bg-olive text-bg text-body font-medium hover:bg-moss transition-colors"
            >
              {navContato}
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="md:hidden p-2 rounded-card text-text"
            aria-label={navToggleLabel}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-bg">
          <div className="px-6 py-5 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault()
                  setIsMobileMenuOpen(false)
                  scrollToAnchor(item.href)
                }}
                className="block text-body font-medium text-text"
              >
                {item.name}
              </a>
            ))}
            <a href="/galeria" className="block text-body font-medium text-text">
              {navGaleria}
            </a>
            <a
              href="#contato"
              onClick={(event) => {
                event.preventDefault()
                setIsMobileMenuOpen(false)
                scrollToAnchor('#contato')
              }}
              className="inline-block px-4 py-2 rounded-card bg-olive text-bg text-body"
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
