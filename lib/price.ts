export function parseBrazilianPriceToCents(priceText: string | null | undefined): number {
  if (!priceText) return 0

  const normalized = priceText
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  const value = Number.parseFloat(normalized)
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid price value: ${priceText}`)
  }

  return Math.round(value * 100)
}

export function formatCentsToBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}
