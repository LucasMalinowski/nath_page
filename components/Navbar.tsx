'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CircleUserRound, Menu, ShoppingCart, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type NavbarProps = {
  backgroundVariant?: 'bg' | 'dirt'
}

const Navbar = ({ backgroundVariant = 'bg' }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const pathname = usePathname()

  const navSobre = 'Sobre'
  const navServicos = 'Serviços'
  const navPortfolio = 'Portfólio'
  const navGaleria = 'Galeria'
  const navContato = 'Contato'
  const navToggleLabel = 'Alternar menu'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadCartCount = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session?.user) {
        setIsLoggedIn(false)
        setCartCount(0)
        return
      }

      setIsLoggedIn(true)

      const { count } = await supabase
        .from('cart_items')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', session.user.id)

      setCartCount(count || 0)
    }

    void loadCartCount()

    const { data: authSubscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session?.user))
      void loadCartCount()
    })

    const handleCartUpdated = () => {
      void loadCartCount()
    }

    window.addEventListener('cart-updated', handleCartUpdated)

    return () => {
      authSubscription.subscription.unsubscribe()
      window.removeEventListener('cart-updated', handleCartUpdated)
    }
  }, [pathname])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMobileMenuOpen])

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

  const accountHref = isLoggedIn ? '/conta' : '/login?next=/conta'

  const isHome = pathname === '/'
  const isGaleria = pathname === '/galeria'
  const toHomeHref = (href: string, isRoute?: boolean) => {
    if (isHome) return href
    if (isRoute && href === '/galeria') return '/galeria'
    if (isRoute) return '/'
    if (href.startsWith('#')) return `/${href}`
    return href
  }

  const handleRouteClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHome || !href) return
    e.preventDefault()
    document.body.classList.add('page-fade-out')
    setTimeout(() => {
      window.location.href = href
    }, 200)
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#3e5f4b]/70 backdrop-blur-sm shadow-sm' : 'bg-[#3e5f4b]/70'
      }`}
    >
      <div className="px-6 sm:px-8">
        <div className="flex items-center h-16 relative">

          {/* ── Mobile layout: hamburger | centered logo | cart + account ── */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-3 rounded-lg transition-colors ${
              backgroundVariant === 'dirt' ? 'text-bg hover:text-olive' : 'text-bg hover:text-gold'
            }`}
            aria-label={navToggleLabel}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Centered logo — absolute so it doesn't shift the side items */}
          <div className="md:hidden absolute left-1/2 -translate-x-1/2">
            {isHome ? (
              <a href="#hero" className="flex items-center">
                <Image src="/nm-gold.png" alt="Nathalia Malinowski" width={48} height={48} className="object-contain w-10 h-10" />
              </a>
            ) : (
              <a href="/#hero" className="flex items-center" onClick={(e) => handleRouteClick(e, '/#hero')}>
                <Image src="/nm-gold.png" alt="Nathalia Malinowski" width={48} height={48} className="object-contain w-10 h-10" />
              </a>
            )}
          </div>

          {/* Right icons on mobile */}
          <div className="md:hidden ml-auto flex items-center gap-4">
            {cartCount > 0 && (
              <Link
                href="/carrinho"
                className={`relative inline-flex items-center justify-center transition-colors ${
                  backgroundVariant === 'dirt' ? 'text-bg hover:text-olive' : 'text-bg hover:text-gold'
                }`}
                aria-label="Ir para carrinho"
              >
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-3 w-4 h-4 md:min-w-5 md:h-5 px-1 rounded-full bg-gold text-dirt text-[11px] font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
            )}
            <Link
              href={accountHref}
              className={`inline-flex items-center justify-center transition-colors ${
                backgroundVariant === 'dirt' ? 'text-bg hover:text-olive' : 'text-bg hover:text-gold'
              }`}
              aria-label={isLoggedIn ? 'Minha conta' : 'Entrar'}
            >
              <CircleUserRound size={20} />
            </Link>
          </div>

          {/* ── Desktop layout: logo | nav links | cart + account ── */}
          <div className="hidden md:flex flex-1 items-center justify-center justify-between pr-12 pl-2">
            {isHome ? (
              <a href="#hero" className="flex items-center">
                <Image
                  src="/nm-gold.png"
                  alt="Nathalia Malinowski"
                  width={34}
                  height={34}
                  className="object-contain w-[34px] h-[34px]"
                />
              </a>
            ) : (
              <a
                href="/#hero"
                className="flex items-center"
                onClick={(e) => handleRouteClick(e, '/#hero')}
              >
                <Image
                    src="/nm-gold.png"
                    alt="Nathalia Malinowski"
                    width={34}
                    height={34}
                    className="object-contain w-[34px] h-[34px]"
                />
              </a>
            )}
            {navItems.map((item) => {
              const href = toHomeHref(item.href, item.isRoute)
              const isAnchor = isHome && item.href.startsWith('#')
              const commonClass = `px-[14px] py-[6px] text-[13px] font-normal tracking-[0.05em] rounded-[5px] transition-colors duration-300 ${
                item.href === '#contato'
                  ? 'bg-[#F5F1EB] text-[#3b2f26] font-medium tracking-[0.06em] ml-2'
                  : item.isRoute && item.href === '/galeria'
                    ? 'bg-[#6b7a5e]/65 text-bg border border-white/10'
                  : item.isRoute
                    ? backgroundVariant === 'dirt'
                      ? 'bg-dirt text-bg hover:text-olive'
                      : 'text-bg hover:text-bg'
                    : backgroundVariant === 'dirt'
                      ? 'text-bg hover:text-olive'
                      : 'text-bg hover:text-bg'
              }`
              if (!isHome && isGaleria && item.isRoute && item.href === '/galeria') {
                return (
                  <span key={item.name} className={`${commonClass} cursor-default`}>
                    {item.name}
                  </span>
                )
              }
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
              if (!isHome) {
                return (
                  <a
                    key={item.name}
                    href={href}
                    className={commonClass}
                    onClick={(e) => handleRouteClick(e, href)}
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
            {cartCount > 0 && (
              <Link
                href="/carrinho"
                className={`relative inline-flex items-center justify-center transition-colors ${
                  backgroundVariant === 'dirt' ? 'text-bg hover:text-olive' : 'text-bg hover:text-gold'
                }`}
                aria-label="Ir para carrinho"
              >
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 rounded-full bg-gold text-dirt text-[11px] font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
            )}
            <Link
              href={accountHref}
              className={`inline-flex items-center justify-center transition-colors ${
                backgroundVariant === 'dirt' ? 'text-bg hover:text-olive' : 'text-bg hover:text-gold'
              }`}
              aria-label={isLoggedIn ? 'Minha conta' : 'Entrar'}
            >
              <CircleUserRound size={22} />
            </Link>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${backgroundVariant === 'dirt' ? 'bg-dirt' : 'bg-[#4e5f4a]'} border-t border-border`}>
          <div className="px-6 py-6 space-y-4">
            {!isHome && (
              <div className="h-0" aria-hidden="true" />
            )}
            {navItems.map((item) => {
              const href = toHomeHref(item.href, item.isRoute)
              const isAnchor = isHome && item.href.startsWith('#')
              const commonClass = `flex items-center py-3 min-h-[44px] text-sm font-medium transition-colors font-sans ${
                item.href === '#contato'
                  ? 'bg-[#ebeae0] text-gold rounded-md px-3'
                  : item.isRoute && item.href === '/galeria'
                    ? 'bg-[#6b7a5e] text-bg rounded-md px-3'
                  : item.isRoute
                    ? backgroundVariant === 'dirt'
                      ? 'text-bg bg-dirt rounded-md px-3'
                      : 'text-bg rounded-md px-3'
                    : backgroundVariant === 'dirt'
                      ? 'text-bg hover:text-olive'
                      : 'text-bg hover:text-gold'
              }`
              if (!isHome && isGaleria && item.isRoute && item.href === '/galeria') {
                return (
                  <span key={item.name} className={`${commonClass} cursor-default`}>
                    {item.name}
                  </span>
                )
              }
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
              if (!isHome) {
                return (
                  <a
                    key={item.name}
                    href={href}
                    className={commonClass}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false)
                      handleRouteClick(e, href)
                    }}
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
            {cartCount > 0 && (
              <Link
                href="/carrinho"
                className={`flex items-center py-3 min-h-[44px] text-sm font-medium transition-colors font-sans ${
                  backgroundVariant === 'dirt' ? 'text-bg hover:text-olive' : 'text-bg hover:text-gold'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingCart size={16} />
                  Carrinho ({cartCount})
                </span>
              </Link>
            )}
            <Link
              href={accountHref}
              className={`flex items-center py-3 min-h-[44px] text-sm font-medium transition-colors font-sans ${
                backgroundVariant === 'dirt' ? 'text-bg hover:text-olive' : 'text-bg hover:text-gold'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="inline-flex items-center gap-2">
                <CircleUserRound size={16} />
                {isLoggedIn ? 'Minha conta' : 'Entrar'}
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
