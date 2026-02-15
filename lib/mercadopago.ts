import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

function getClient() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error('Missing MERCADO_PAGO_ACCESS_TOKEN')
  }

  return new MercadoPagoConfig({
    accessToken,
    options: {
      timeout: 5000
    }
  })
}

export function getMercadoPagoPreference() {
  return new Preference(getClient())
}

export function getMercadoPagoPayment() {
  return new Payment(getClient())
}
