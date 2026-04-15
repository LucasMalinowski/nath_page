import { parseBrazilianPriceToCents } from '@/lib/price'

type ProductLike = {
  id: string
  name: string | null
  price_text: string | null
  quantity: number | null
  package_weight_grams: number | null
  package_height_cm: number | string | null
  package_width_cm: number | string | null
  package_length_cm: number | string | null
}

type UserProfileLike = {
  full_name: string | null
  phone: string | null
  document: string | null
  address_line1: string | null
  address_line2: string | null
  address_number: string | null
  district: string | null
  city: string | null
  state: string | null
  postal_code: string | null
}

function sanitizePostalCode(value: string | null | undefined) {
  return (value || '').replace(/\D/g, '')
}

function sanitizeDocument(value: string | null | undefined) {
  return (value || '').replace(/\D/g, '')
}

function sanitizePhone(value: string | null | undefined) {
  return (value || '').replace(/\D/g, '')
}

function normalizeDimension(value: number | string | null | undefined) {
  const numberValue = typeof value === 'string' ? Number.parseFloat(value) : Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : 0
}

export function ensureShippableProducts(products: ProductLike[]) {
  const invalid = products.find((product) => {
    const quantity = product.quantity ?? 0
    return (
      quantity <= 0 ||
      !product.package_weight_grams ||
      normalizeDimension(product.package_height_cm) <= 0 ||
      normalizeDimension(product.package_width_cm) <= 0 ||
      normalizeDimension(product.package_length_cm) <= 0
    )
  })

  if (invalid) {
    throw new Error(`Produto sem dimensões de envio configuradas: ${invalid.name || invalid.id}`)
  }
}

export function buildQuoteProducts(items: Array<{ product: ProductLike; quantity: number }>) {
  return items.map(({ product, quantity }) => ({
    name: product.name || 'Produto',
    quantity,
    height: normalizeDimension(product.package_height_cm),
    width: normalizeDimension(product.package_width_cm),
    length: normalizeDimension(product.package_length_cm),
    weight: convertWeightGramsToKg(product.package_weight_grams || 0),
    unitary_value: Number((parseBrazilianPriceToCents(product.price_text) / 100).toFixed(2))
  }))
}

export function buildShippingDeclarationProducts(items: Array<{ product: ProductLike; quantity: number }>) {
  return items.map(({ product, quantity }) => ({
    name: product.name || 'Produto',
    quantity,
    unitary_value: Number((parseBrazilianPriceToCents(product.price_text) / 100).toFixed(2))
  }))
}

export function buildVolumeFromItems(items: Array<{ product: ProductLike; quantity: number }>) {
  ensureShippableProducts(items.map((item) => item.product))

  const weight = items.reduce((sum, item) => sum + (item.product.package_weight_grams || 0) * item.quantity, 0)
  const height = items.reduce((sum, item) => sum + normalizeDimension(item.product.package_height_cm) * item.quantity, 0)
  const width = items.reduce((max, item) => Math.max(max, normalizeDimension(item.product.package_width_cm)), 0)
  const length = items.reduce((max, item) => Math.max(max, normalizeDimension(item.product.package_length_cm)), 0)

  return {
    height: Number(height.toFixed(2)),
    width: Number(width.toFixed(2)),
    length: Number(length.toFixed(2)),
    weight
  }
}

export function convertWeightGramsToKg(weightGrams: number) {
  return Number((weightGrams / 1000).toFixed(3))
}

export function normalizeShippingOptions(raw: any[]) {
  return (raw || [])
    .map((entry) => ({
      serviceCode: Number(entry?.id ?? entry?.service ?? entry?.service_id ?? 0),
      serviceName: String(entry?.name || entry?.service_name || 'Frete'),
      carrierName: String(entry?.company?.name || entry?.company?.fantasy_name || entry?.carrier || ''),
      priceCents: Math.round(Number(entry?.price ?? entry?.custom_price ?? 0) * 100),
      deliveryDays: Number(entry?.delivery_time ?? entry?.delivery_days ?? 0),
      packages: entry?.packages || [],
      raw: entry
    }))
    .filter((entry) => entry.serviceCode > 0 && entry.priceCents >= 0)
    .sort((a, b) => a.priceCents - b.priceCents)
}

export function assertCompleteShippingProfile(profile: UserProfileLike) {
  const missing: string[] = []

  if (!profile.full_name?.trim()) missing.push('nome completo')
  if (!sanitizePhone(profile.phone)) missing.push('telefone')
  if (!sanitizeDocument(profile.document)) missing.push('CPF/CNPJ')
  if (!profile.address_line1?.trim()) missing.push('rua')
  if (!profile.address_number?.trim()) missing.push('número')
  if (!profile.district?.trim()) missing.push('bairro')
  if (!profile.city?.trim()) missing.push('cidade')
  if (!profile.state?.trim()) missing.push('estado')
  if (!sanitizePostalCode(profile.postal_code)) missing.push('CEP')

  if (missing.length > 0) {
    throw new Error(`Complete seu cadastro antes de calcular o frete: ${missing.join(', ')}`)
  }
}

export function buildRecipientAddress(profile: UserProfileLike, email: string) {
  assertCompleteShippingProfile(profile)

  return {
    name: profile.full_name!.trim(),
    postal_code: sanitizePostalCode(profile.postal_code),
    address: profile.address_line1!.trim(),
    number: profile.address_number!.trim(),
    district: profile.district!.trim(),
    city: profile.city!.trim(),
    state_abbr: profile.state!.trim().toUpperCase(),
    complement: profile.address_line2?.trim() || undefined,
    phone: sanitizePhone(profile.phone),
    email,
    document: sanitizeDocument(profile.document)
  }
}

export function pickOriginPostalCode(addresses: any[]) {
  const preferred = addresses.find((address) => address?.default) || addresses[0]
  const postalCode = sanitizePostalCode(
    preferred?.postal_code || preferred?.zip_code || preferred?.cep || process.env.SUPERFRETE_SENDER_POSTAL_CODE
  )

  if (!postalCode) {
    throw new Error('SuperFrete sender address is not configured')
  }

  return postalCode
}

export function buildSenderAddress(addresses: any[], user: any) {
  const preferred = addresses.find((address) => address?.default) || addresses[0]
  if (!preferred) {
    throw new Error('No sender address found in SuperFrete account')
  }

  const postalCode = sanitizePostalCode(preferred.postal_code || preferred.zip_code || preferred.cep)
  const street = preferred.address || preferred.street || preferred.address_line1
  const number = String(preferred.number || preferred.address_number || '')
  const district = preferred.district || preferred.neighborhood
  const city = preferred.city
  const state = preferred.state_abbr || preferred.state
  const name = preferred.name || user?.name || process.env.SUPERFRETE_SENDER_NAME

  if (!postalCode || !street || !number || !district || !city || !state || !name) {
    throw new Error('Sender address in SuperFrete account is incomplete')
  }

  return {
    name,
    company_name: preferred.company_name || undefined,
    postal_code: postalCode,
    address: street,
    number,
    district,
    city,
    state_abbr: String(state).toUpperCase(),
    complement: preferred.complement || undefined,
    phone: sanitizePhone(preferred.phone || user?.phone || process.env.SUPERFRETE_SENDER_PHONE),
    email: preferred.email || user?.email || process.env.SUPERFRETE_SENDER_EMAIL,
    document: sanitizeDocument(preferred.document || user?.document || process.env.SUPERFRETE_SENDER_DOCUMENT)
  }
}
