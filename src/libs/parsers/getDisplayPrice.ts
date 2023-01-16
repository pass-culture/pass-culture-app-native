import { CENTS_IN_EURO, convertEuroToCents } from 'libs/parsers/pricesConversion'

const EURO_SYMBOL = '€'

/**
 * Takes a price in cents (ex: 5.5€ = 550 cents) and returns a string with the
 * price in euros in the French format, ex: "5,50 €"
 * @param {number} priceInCents
 */
export const formatToFrenchDecimal = (priceInCents: number) => {
  const euros = priceInCents / CENTS_IN_EURO
  // we show 2 decimals if price is not round. Ex: 21,50 €
  const fixed = euros === Math.floor(euros) ? euros : euros.toFixed(2)
  return `${fixed.toString().replace('.', ',')}\u00a0${EURO_SYMBOL}`
}

export const formatPriceInEuroToDisplayPrice = (priceInEuro: number) =>
  formatToFrenchDecimal(convertEuroToCents(priceInEuro))

const getPricePerPlace = (prices: number[]): string => {
  const uniquePrices = Array.from(new Set(prices.filter((p) => p > 0)))
  if (uniquePrices.length === 1) return `${formatToFrenchDecimal(uniquePrices[0])}`
  const sortedPrices = [...uniquePrices].sort((a, b) => a - b)
  return `Dès ${formatToFrenchDecimal(sortedPrices[0])}`
}

export const getDisplayPrice = (prices: number[] | undefined): string => {
  if (!prices || prices.length === 0) return ''
  if (prices.includes(0)) return 'Gratuit'
  return getPricePerPlace(prices)
}

export const getDisplayPriceWithDuoMention = (prices: number[] | undefined): string => {
  if (!prices || prices.length === 0) return ''
  if (prices.includes(0)) return 'Gratuit'
  return `${getPricePerPlace(prices)} / place`
}
