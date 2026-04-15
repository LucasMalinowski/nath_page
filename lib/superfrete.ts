type SuperFreteAddress = {
  name: string
  company_name?: string | null
  postal_code: string
  address: string
  number: string
  district: string
  city: string
  state_abbr: string
  complement?: string | null
  phone?: string | null
  email?: string | null
  document?: string | null
}

type SuperFreteProduct = {
  quantity: number
  height?: number
  width?: number
  length?: number
  weight?: number
  name?: string
  unitary_value?: number
}

type SuperFretePackage = {
  height: number
  width: number
  length: number
  weight: number
}

type QuoteRequest = {
  from: { postal_code: string }
  to: { postal_code: string }
  services: string
  package?: SuperFretePackage
  products: SuperFreteProduct[]
  options?: Record<string, unknown>
}

type CreateOrderRequest = {
  from: SuperFreteAddress
  to: SuperFreteAddress
  service: number
  products: SuperFreteProduct[]
  volumes: SuperFretePackage
  options?: Record<string, unknown>
  platform?: string
}

function getBaseUrl() {
  const env = (process.env.SUPERFRETE_BASE_URL || 'https://sandbox.superfrete.com').replace(/\/$/, '')
  return env
}

function getToken() {
  const token = process.env.SUPERFRETE_TOKEN
  if (!token) {
    throw new Error('Missing SUPERFRETE_TOKEN')
  }

  return token
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    cache: 'no-store'
  })

  const text = await response.text()
  let data: T | { message?: string; error?: string; details?: unknown; data?: unknown } = {} as T

  if (text) {
    try {
      data = JSON.parse(text) as T | { message?: string; error?: string; details?: unknown; data?: unknown }
    } catch {
      data = { error: text }
    }
  }

  if (!response.ok) {
    const errorData = data as { message?: string; error?: string; details?: unknown; data?: unknown }
    const details =
      errorData.details !== undefined
        ? JSON.stringify(errorData.details)
        : errorData.data !== undefined
          ? JSON.stringify(errorData.data)
          : text
    const baseMessage =
      errorData.message ||
      errorData.error ||
      `SuperFrete request failed with ${response.status}`
    const message = details && details !== baseMessage ? `${baseMessage} (${details})` : baseMessage

    throw new Error(message)
  }

  return data as T
}

export function isSuperFreteConfigured() {
  return Boolean(process.env.SUPERFRETE_TOKEN)
}

export async function quoteSuperFrete(requestBody: QuoteRequest) {
  return request<unknown[]>('/api/v0/calculator', {
    method: 'POST',
    body: JSON.stringify(requestBody)
  })
}

export async function createSuperFreteOrder(requestBody: CreateOrderRequest) {
  return request<any>('/api/v0/cart', {
    method: 'POST',
    body: JSON.stringify(requestBody)
  })
}

export async function checkoutSuperFreteOrder(orderIds: string[]) {
  return request<any>('/api/v0/checkout', {
    method: 'POST',
    body: JSON.stringify({
      orders: orderIds
    })
  })
}

export async function getSuperFreteAddresses() {
  const response = await request<any>('/api/v0/user/addresses', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.addresses)) return response.addresses
  if (Array.isArray(response?.results)) return response.results

  return []
}

export async function getSuperFreteUser() {
  return request<any>('/api/v0/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function getSuperFreteBalance() {
  const user = await getSuperFreteUser()
  const balance = Number(user?.balance ?? user?.wallet?.balance ?? 0)
  if (!Number.isFinite(balance)) {
    throw new Error('SuperFrete balance is unavailable')
  }

  return balance
}
