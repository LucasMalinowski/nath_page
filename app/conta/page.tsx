'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, UserRound } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase, UserProfile } from '@/lib/supabase'

const EMPTY_PROFILE = {
  full_name: '',
  phone: '',
  document: '',
  address_line1: '',
  address_number: '',
  address_line2: '',
  district: '',
  city: '',
  state: '',
  postal_code: ''
}

const BRAZILIAN_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO'
] as const

export default function ContaPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_PROFILE)

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.replace('/login?next=/conta')
        return
      }

      setEmail(session.user.email || '')

      const { data, error: profileError } = await supabase
        .from('users')
        .select(
          'full_name, phone, document, address_line1, address_number, address_line2, district, city, state, postal_code'
        )
        .eq('id', session.user.id)
        .maybeSingle()

      if (profileError) {
        setError(profileError.message)
      } else if (data) {
        const profile = data as Pick<
          UserProfile,
          | 'full_name'
          | 'phone'
          | 'document'
          | 'address_line1'
          | 'address_number'
          | 'address_line2'
          | 'district'
          | 'city'
          | 'state'
          | 'postal_code'
        >

        setForm({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          document: profile.document || '',
          address_line1: profile.address_line1 || '',
          address_number: profile.address_number || '',
          address_line2: profile.address_line2 || '',
          district: profile.district || '',
          city: profile.city || '',
          state: profile.state || '',
          postal_code: profile.postal_code || ''
        })
      }

      setLoading(false)
    }

    void loadProfile()
  }, [router])

  const updateField = (key: keyof typeof EMPTY_PROFILE, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }))
  }

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session?.user) {
      router.replace('/login?next=/conta')
      return
    }

    const { error: upsertError } = await supabase.from('users').upsert({
      id: session.user.id,
      full_name: form.full_name.trim() || null,
      phone: form.phone.trim() || null,
      document: form.document.trim() || null,
      address_line1: form.address_line1.trim() || null,
      address_number: form.address_number.trim() || null,
      address_line2: form.address_line2.trim() || null,
      district: form.district.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      postal_code: form.postal_code.trim() || null
    })

    setSaving(false)

    if (upsertError) {
      setError(upsertError.message)
      return
    }

    setMessage('Cadastro atualizado com sucesso.')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#3b2f26] page-fade-in">
      <Navbar backgroundVariant="dirt" />

      <section className="pt-28 pb-16 px-6 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-[#d8cdbf] bg-[#f7f3ec] p-6 shadow-[0_24px_60px_rgba(59,47,38,0.12)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 border-b border-[#dccfbc] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-2 text-[12px] uppercase tracking-[0.24em] text-[#8f7a64]">
                <UserRound size={14} />
                Minha conta
              </p>
              <h1 className="mt-4 text-4xl font-serif text-[#3b2f26]">Perfil e entrega</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#735746]">
                Preencha seus dados para calcular frete, finalizar a compra e emitir a etiqueta automaticamente.
              </p>
            </div>

            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-sm text-[#3b2f26] transition-colors hover:border-[#b89b5e]"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>

          {loading ? (
            <p className="py-10 text-[#735746]">Carregando conta...</p>
          ) : (
            <form onSubmit={saveProfile} className="mt-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">Email</label>
                  <input
                    value={email}
                    readOnly
                    className="mt-2 w-full rounded-[14px] border border-[#d8cdbf] bg-[#efe8dd] px-4 py-3 text-[#6f6257]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">Nome completo</label>
                  <input
                    value={form.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    className="mt-2 w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">Telefone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="mt-2 w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">CPF ou CNPJ</label>
                  <input
                    value={form.document}
                    onChange={(e) => updateField('document', e.target.value)}
                    className="mt-2 w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26]"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
                <div>
                  <label className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">Rua</label>
                  <input
                    value={form.address_line1}
                    onChange={(e) => updateField('address_line1', e.target.value)}
                    className="mt-2 w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">Número</label>
                  <input
                    value={form.address_number}
                    onChange={(e) => updateField('address_number', e.target.value)}
                    className="mt-2 w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26]"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">Complemento</label>
                  <input
                    value={form.address_line2}
                    onChange={(e) => updateField('address_line2', e.target.value)}
                    className="mt-2 w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">Bairro</label>
                  <input
                    value={form.district}
                    onChange={(e) => updateField('district', e.target.value)}
                    className="mt-2 w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">Cidade</label>
                  <input
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="mt-2 w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26]"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">Estado</label>
                    <select
                      value={form.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="mt-2 w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26]"
                      required
                    >
                      <option value="">Selecione</option>
                      {BRAZILIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] uppercase tracking-[0.18em] text-[#8f7a64]">CEP</label>
                    <input
                      value={form.postal_code}
                      onChange={(e) => updateField('postal_code', e.target.value)}
                      className="mt-2 w-full rounded-[14px] border border-[#d8cdbf] bg-[#fbf8f2] px-4 py-3 text-[#3b2f26]"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="rounded-[14px] bg-[#735746] px-6 py-3 text-[#f5f1eb] transition-colors hover:bg-[#644435] disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar dados'}
              </button>

              {error && <p className="rounded-[14px] border border-[#c97f71]/25 bg-[#f8e7e2] px-4 py-3 text-sm text-[#8f3d2f]">{error}</p>}
              {message && <p className="rounded-[14px] border border-[#b9c8b0] bg-[#edf4e7] px-4 py-3 text-sm text-[#4c6143]">{message}</p>}
            </form>
          )}
        </div>
      </section>

      <Footer contactInfo={false} />
    </main>
  )
}
