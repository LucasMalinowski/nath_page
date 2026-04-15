'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, UserRound } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type AuthMode = 'signin' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [next, setNext] = useState('/conta')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nextParam = params.get('next')
    if (nextParam && nextParam.startsWith('/')) {
      setNext(nextParam)
    }
  }, [])

  const callbackUrl = useMemo(() => {
    if (typeof window === 'undefined') return undefined
    const url = new URL('/auth/callback', window.location.origin)
    url.searchParams.set('next', next)
    return url.toString()
  }, [next])

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'signin') {
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
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: callbackUrl,
        data: {
          full_name: fullName.trim()
        }
      }
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      router.push(next)
      return
    }

    setMessage('Conta criada. Confira seu email para confirmar o acesso.')
  }

  const oauthLogin = async () => {
    setError(null)
    setMessage(null)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl
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
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[28px] border border-[#d8cdbf] bg-[#f7f3ec]/95 p-6 shadow-[0_24px_60px_rgba(59,47,38,0.12)] backdrop-blur-sm sm:p-8 lg:p-10">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.24em] text-[#8f7a64]">Acesso</p>
                  <h2 className="mt-3 text-3xl font-serif text-[#3b2f26] sm:text-[38px]">
                    {mode === 'signin' ? 'Entrar' : 'Criar conta'}
                  </h2>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#735746]">
                    {mode === 'signin'
                      ? 'Use seu email para acessar carrinho, perfil e entregas.'
                      : 'Crie sua conta para salvar seus dados e comprar com frete calculado no checkout.'}
                  </p>
                </div>
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ebe3d3] text-[#735746] sm:flex">
                  <Mail size={20} />
                </div>
              </div>

              <div className="mb-6 inline-flex rounded-full border border-[#d8cdbf] bg-[#fbf8f2] p-1">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    mode === 'signin' ? 'bg-[#735746] text-[#f5f1eb]' : 'text-[#735746]'
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    mode === 'signup' ? 'bg-[#735746] text-[#f5f1eb]' : 'text-[#735746]'
                  }`}
                >
                  Criar conta
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label htmlFor="full_name" className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">
                      Nome completo
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      placeholder="Seu nome"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26] outline-none transition-colors placeholder:text-[#a2907d] focus:border-[#b89b5e]"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="voce@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26] outline-none transition-colors placeholder:text-[#a2907d] focus:border-[#b89b5e]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder={mode === 'signin' ? 'Sua senha' : 'Crie uma senha segura'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26] outline-none transition-colors placeholder:text-[#a2907d] focus:border-[#b89b5e]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[14px] bg-[#735746] px-4 py-3 text-[17px] text-[#f5f1eb] transition-colors hover:bg-[#644435] disabled:opacity-60"
                >
                  {loading ? 'Processando...' : mode === 'signin' ? 'Entrar com email' : 'Criar conta'}
                </button>
              </form>

              <div className="my-6 h-px bg-[#d8cdbf]" />

              <button
                type="button"
                onClick={oauthLogin}
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

              {message && (
                <p className="mt-4 rounded-[14px] border border-[#b9c8b0] bg-[#edf4e7] px-4 py-3 text-sm text-[#4c6143]">
                  {message}
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
