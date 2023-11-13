import { CENTS_IN_EURO, convertEuroToCents } from 'libs/parsers/pricesConversion'

type FormatPriceOptions = {
  fractionDigits?: number
}

/**
 * Takes a price in cents (ex: 5.5€ = 550 cents) and returns a string with the
 * price in euros in the French format, ex: "5,50 €"
 * @param {number} priceInCents
 */
export const formatToFrenchDecimal = (priceInCents: number, options?: FormatPriceOptions) => {
  const euros = priceInCents / CENTS_IN_EURO
  const fractionDigits = options?.fractionDigits ?? (euros === Math.floor(euros) ? 0 : 2)

  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: fractionDigits,
  })

  return formatter.format(euros)
}

export const formatPriceInEuroToDisplayPrice = (priceInEuro: number) =>
  formatToFrenchDecimal(convertEuroToCents(priceInEuro))

const getPricePerPlace = (prices: number[], options?: FormatPriceOptions): string => {
  const uniquePrices = Array.from(new Set(prices.filter((p) => p > 0)))

  if (uniquePrices.length === 1) return `${formatToFrenchDecimal(uniquePrices[0], options)}`

  const sortedPrices = [...uniquePrices].sort((a, b) => a - b)
  return `Dès ${formatToFrenchDecimal(sortedPrices[0], options)}`
}

export const getDisplayPrice = (
  prices: number[] | undefined,
  options?: FormatPriceOptions
): string => {
  if (!prices || prices.length === 0) return ''
  if (prices.includes(0)) return 'Gratuit'
  return getPricePerPlace(prices, options)
}

export const getDisplayPriceWithDuoMention = (prices: number[] | undefined): string => {
  if (!prices || prices.length === 0) return ''
  if (prices.includes(0)) return 'Gratuit'
  return `${getPricePerPlace(prices)} / place`
}
