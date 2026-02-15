'use client'

import { FormEvent, useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LoginPage() {
  const router = useRouter()
  const [next, setNext] = useState('/carrinho')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const nextParam = new URLSearchParams(window.location.search).get('next')
    if (nextParam && nextParam.startsWith('/')) {
      setNext(nextParam)
    }
  }, [])

  const handlePasswordLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }

    router.push(next)
  }

  const oauthLogin = async (provider: 'google' | 'apple') => {
    setError(null)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: "https://nathalia-malinowski.vercel.app/auth/callback"
      }
    })

    if (oauthError) {
      setError(oauthError.message)
    }
  }

  return (
    <main className="min-h-screen bg-dirt text-bg page-fade-in">
      <Navbar backgroundVariant="dirt" />

      <section className="texture-brown min-h-screen pt-28 pb-16 px-6 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-serif text-gold/90">Entrar</h1>
            <p className="mt-3 text-bg/70 font-sans">
              Faça login para comprar obras na galeria.
            </p>
          </div>

          <div className="max-w-xl mx-auto border border-gold/45 bg-[#4B4038]/45 p-6 sm:p-8">
            <form onSubmit={handlePasswordLogin} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gold/40 bg-transparent rounded px-3 py-2 text-bg placeholder:text-bg/60"
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gold/40 bg-transparent rounded px-3 py-2 text-bg placeholder:text-bg/60"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-[#3b2f26] rounded-sm px-4 py-3 font-medium hover:bg-[#e6c98a] transition-colors disabled:opacity-60"
              >
                {loading ? 'Entrando...' : 'Entrar com email'}
              </button>
            </form>

            <div className="my-5 h-px bg-gold/30" />

            <button
              type="button"
              onClick={() => oauthLogin('google')}
              className="w-full border border-gold/40 rounded px-4 py-3 text-bg inline-flex items-center justify-center gap-2 hover:bg-gold/15 transition-colors"
            >
              <Image src="/google.png" alt="Google" width={18} height={18} />
              Continuar com Google
            </button>

            {error && <p className="mt-4 text-sm text-red-200">{error}</p>}
          </div>
        </div>
      </section>

      <Footer contactInfo={false} />
    </main>
  )
}
