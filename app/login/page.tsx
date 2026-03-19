'use client'

import { FormEvent, useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
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
    <main className="min-h-screen bg-[#f5f1eb] text-[#3b2f26] page-fade-in">
      <Navbar backgroundVariant="dirt" />

      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(107,122,94,0.16),rgba(245,241,235,0.92)_38%,rgba(184,155,94,0.14))]" />
        <div className="absolute left-0 top-0 h-full w-full texture-white opacity-40" />

        <div className="relative px-6 sm:px-8 lg:px-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <div className="flex flex-col justify-between rounded-[28px] bg-[#5d6d59] px-8 py-10 text-[#f5f1eb] shadow-[0_24px_60px_rgba(59,47,38,0.18)] sm:px-10 lg:px-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f5f1eb]/20 bg-[#f5f1eb]/10 px-4 py-2 text-[12px] font-sans uppercase tracking-[0.24em] text-[#f1e7d2]">
                  <ShieldCheck size={14} />
                  Acesso restrito
                </div>
                <h1 className="mt-8 max-w-md text-4xl font-serif leading-[0.95] text-[#f1e0b4] sm:text-5xl">
                  Login administrativo com a linguagem visual do site.
                </h1>
                <p className="mt-6 max-w-md text-[16px] leading-relaxed text-[#f5f1eb]/80">
                  Esta entrada existe apenas para gerenciamento interno. O acesso libera o painel e as rotinas administrativas da galeria.
                </p>
              </div>

              <div className="mt-12 border-l border-[#f5f1eb]/25 pl-5">
                <p className="font-serif text-[22px] leading-tight text-[#f5f1eb]/88">
                  Curadoria, controle e atualização
                  <br />
                  em um ambiente mais coerente.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#d8cdbf] bg-[#f7f3ec]/95 p-6 shadow-[0_24px_60px_rgba(59,47,38,0.12)] backdrop-blur-sm sm:p-8 lg:p-10">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-sans uppercase tracking-[0.24em] text-[#8f7a64]">
                    Área administrativa
                  </p>
                  <h2 className="mt-3 text-3xl font-serif text-[#3b2f26] sm:text-[38px]">
                    Entrar
                  </h2>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#735746]">
                    Use suas credenciais para acessar o painel. Este login não é destinado a clientes da galeria.
                  </p>
                </div>
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ebe3d3] text-[#735746] sm:flex">
                  <LockKeyhole size={20} />
                </div>
              </div>

              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[13px] font-sans uppercase tracking-[0.18em] text-[#8f7a64]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="voce@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26] outline-none transition-colors placeholder:text-[#a2907d] focus:border-[#b89b5e]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-[13px] font-sans uppercase tracking-[0.18em] text-[#8f7a64]">
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26] outline-none transition-colors placeholder:text-[#a2907d] focus:border-[#b89b5e]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[14px] bg-[#735746] px-4 py-3 font-sans text-[17px] text-[#f5f1eb] transition-colors hover:bg-[#644435] disabled:opacity-60"
                >
                  {loading ? 'Entrando...' : 'Entrar com email'}
                </button>
              </form>

              <div className="my-6 h-px bg-[#d8cdbf]" />

              <button
                type="button"
                onClick={() => oauthLogin('google')}
                className="flex w-full items-center justify-center gap-3 rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26] transition-colors hover:border-[#b89b5e] hover:bg-[#f3ede2]"
              >
                <Image src="/google.png" alt="Google" width={18} height={18} />
                Continuar com Google
              </button>

              {error && (
                <p className="mt-4 rounded-[14px] border border-[#c97f71]/25 bg-[#f8e7e2] px-4 py-3 text-sm text-[#8f3d2f]">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer contactInfo={false} />
    </main>
  )
}
