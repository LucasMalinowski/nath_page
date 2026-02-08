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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return
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

  const isHome = pathname === '/'
  const toHomeHref = (href: string, isRoute?: boolean) => {
    if (isHome) return href
    if (isRoute) return '/'
    if (href.startsWith('#')) return `/${href}`
    return href
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-bg/70 backdrop-blur-sm shadow-sm' : 'bg-bg/90'
      }`}
    >
      <div className="px-6 sm:px-8 ">
        <div className="flex items-center h-16">
          <div className="hidden md:flex flex-1 items-center justify-center justify-between pr-20 pl-2">
            <Link href={isHome ? '#hero' : '/#hero'} className="flex items-center">
              <Image
                src="/nm-logo-black.png"
                alt="Nathalia Malinowski"
                width={20}
                height={20}
                className="object-contain w-20 h-20"
              />
            </Link>
            {navItems.map((item) => {
              const href = toHomeHref(item.href, item.isRoute)
              const isAnchor = isHome && item.href.startsWith('#')
              const commonClass = `px-3 py-1 text-[20px] font-thin rounded-lg transition-colors duration-300 ${
                item.href === '#contato'
                  ? 'bg-olive text-bg hover:bg-moss'
                  : item.isRoute
                    ? 'bg-bg text-text hover:text-olive'
                    : 'text-text hover:text-olive'
              }`
              if (isAnchor) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={commonClass}
                  >
                    {item.name}
                  </a>
                )
              }
              return (
                <Link key={item.name} href={href} className={commonClass}>
                  {item.name}
                </Link>
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
              <div className="h-0" aria-hidden="true" />
            )}
            {navItems.map((item) => {
              const href = toHomeHref(item.href, item.isRoute)
              const isAnchor = isHome && item.href.startsWith('#')
              const commonClass = `block py-3 text-sm font-medium transition-colors font-sans ${
                item.href === '#contato'
                  ? 'bg-olive text-bg rounded-md px-3'
                  : item.isRoute
                    ? 'text-text bg-bg rounded-md px-3'
                    : 'text-text hover:text-olive'
              }`
              if (isAnchor) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={commonClass}
                  >
                    {item.name}
                  </a>
                )
              }
              return (
                <Link
                  key={item.name}
                  href={href}
                  className={commonClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
