'use client'

import { useEffect, useMemo, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useBrandAsset } from '@/lib/useBrandAsset'
import { useSiteText } from '@/lib/siteText'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('#hero')
  useBrandAsset('navbar')
  const pathname = usePathname()

  const navSobre = useSiteText('nav_sobre', 'Sobre')
  const navServicos = useSiteText('nav_servicos', 'Serviços')
  const navPortfolio = useSiteText('nav_portfolio', 'Portfólio')
  const navGaleria = useSiteText('nav_galeria', 'Galeria')
  const navContato = useSiteText('nav_contato', 'Contato')
  const navToggleLabel = useSiteText('nav_toggle_label', 'Alternar menu')
  const navBackLabel = useSiteText('nav_back_label', 'Voltar')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = useMemo(() => ([
    { name: navSobre, href: '#sobre' },
    { name: navPortfolio, href: '#portfolio' },
    { name: navServicos, href: '#servicos' },
    { name: navGaleria, href: '/galeria', isRoute: true },
    { name: navContato, href: '#contato' }
  ]), [navSobre, navPortfolio, navServicos, navGaleria, navContato])

  useEffect(() => {
    if (pathname !== '/') return
    const sectionIds = ['#sobre', '#portfolio', '#servicos', '#contato']
    const sections = sectionIds
      .map((id) => document.querySelector(id))
      .filter((el): el is Element => Boolean(el))

    if (sections.length === 0) return

    const updateActive = () => {
      const scrollY = window.scrollY + 120
      let current = '#hero'
      sections.forEach((section) => {
        if (scrollY >= section.getBoundingClientRect().top + window.scrollY) {
          current = `#${section.id}`
        }
      })
      setActiveSection(current)
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)

    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [pathname])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    setIsMobileMenuOpen(false)
    setActiveSection(href)

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

  const isHome = pathname === '/'

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-bg/80 backdrop-blur-sm shadow-sm' : 'bg-bg'
      }`}
    >
      <div className="px-6 sm:px-8 ">
        <div className="flex items-center h-16">
          <div className="hidden md:flex flex-1 items-center justify-center justify-between px-20">
            {isHome ? (
              <a href="#hero" className="flex items-center">
                <Image
                  src="/nm-logo-black.png"
                  alt="Nathalia Malinowski"
                  width={20}
                  height={20}
                  className="object-contain w-20 h-20"
                />
              </a>
            ) : (
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-text hover:text-olive transition-colors"
              >
                {navBackLabel}
              </Link>
            )}
            {navItems.map((item) => {
              if (item.isRoute) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-1 text-[20px] font-thin rounded-full text-text hover:text-olive transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                )
              }
              const isActive = isHome && activeSection === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-3 py-1 text-[20px] font-thin rounded-lg transition-colors duration-300 ${
                    isActive ? 'bg-olive text-bg' : 'text-text hover:text-olive'
                  }`}
                >
                  {item.name}
                </a>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text hover:text-olive transition-colors"
            aria-label={navToggleLabel}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-bg border-t border-border">
          <div className="px-6 py-6 space-y-4">
            {!isHome && (
              <Link
                href="/"
                className="block py-3 text-sm font-medium text-text hover:text-olive transition-colors font-sans"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {navBackLabel}
              </Link>
            )}
            {navItems.map((item) => {
              if (item.isRoute) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-3 text-sm font-medium text-text hover:text-olive transition-colors font-sans"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              }
              const isActive = isHome && activeSection === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block py-3 text-sm font-medium transition-colors font-sans ${
                    isActive ? 'text-olive' : 'text-text hover:text-olive'
                  }`}
                >
                  {item.name}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
