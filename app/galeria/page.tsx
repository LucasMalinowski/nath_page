'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { exhibitors, formatPrice, galleryProducts } from '@/lib/content'

export default function GaleriaPage() {
  return (
    <main className="min-h-screen bg-text text-bg">
      <header className="sticky top-0 z-40 bg-bg text-text border-b border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 h-20 flex items-center justify-between">
          <Link href="/" className="text-h3">NM</Link>
          <nav className="flex items-center gap-6 text-body">
            <Link href="/#sobre">Sobre</Link>
            <Link href="/#portfolio">Portfólio</Link>
            <Link href="/#servicos">Serviços</Link>
            <Link href="/galeria" className="px-4 py-2 rounded-card bg-olive text-bg">Galeria</Link>
          </nav>
        </div>
      </header>

      <section className="py-16 border-b border-bg/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 grid md:grid-cols-2 gap-8 items-end">
          <h1 className="text-h1-mobile md:text-h1 text-mustard">Galeria e Curadoria</h1>
          <p className="text-h3-mobile md:text-h3">A arte não decora. Ela dialoga.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {galleryProducts.map((product) => (
              <article key={product.id} className="border border-gold/60 rounded-card p-4 bg-bg/5 backdrop-blur-sm">
                <div className="relative aspect-square border border-gold/60 rounded-card overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={`TODO: Add photo for ${product.title}`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button className="inline-flex items-center gap-2 text-bg hover:text-mustard transition-colors">
                    <ShoppingCart size={20} />
                    <span>Adicionar</span>
                  </button>
                  <strong className="text-h3-mobile md:text-h3">{formatPrice(product.priceCents)}</strong>
                </div>

                <h2 className="text-h3-mobile md:text-h3 mt-5">“{product.title}”</h2>
                <p className="text-body-mobile md:text-body text-bg/90 mt-2">{product.description}</p>
                <p className="text-small mt-3 text-mustard">{product.artistName}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-card border border-bg/30 p-5 flex items-center justify-between">
            <p className="text-body">Carrinho (UI): 0 itens</p>
            <button className="px-5 py-2 rounded-card bg-mustard text-text font-medium">Finalizar pagamento</button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-moss paper-texture">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
          <h2 className="text-h1-mobile md:text-h1 text-mustard mb-8">Expositores</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {exhibitors.map((exhibitor) => (
              <article key={exhibitor.id} className="rounded-card border border-bg/40 p-5 bg-bg/10 flex gap-4 items-center">
                <div className="relative h-24 w-24 rounded-card overflow-hidden border border-bg/40">
                  <Image src={exhibitor.photo} alt={`TODO: Add photo for ${exhibitor.name}`} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-h3-mobile md:text-h3">{exhibitor.name}</h3>
                  <p className="text-body-mobile md:text-body text-bg/90">{exhibitor.role}</p>
                  {exhibitor.instagram ? (
                    <a href={`https://instagram.com/${exhibitor.instagram}`} target="_blank" rel="noreferrer" className="text-small text-mustard">
                      @{exhibitor.instagram}
                    </a>
                  ) : null}
                  {exhibitor.quote ? <p className="poetic text-2xl mt-2">{exhibitor.quote}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
