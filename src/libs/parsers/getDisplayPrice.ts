import { convertEuroToXPF } from 'libs/parsers/convertEuroToXPF'
import { CENTS_IN_EURO, convertEuroToCents } from 'libs/parsers/pricesConversion'
import { Currency } from 'libs/parsers/useGetCurrentCurrency'

type FormatPriceOptions = {
  fractionDigits?: number
}

/**
 * Takes a price in cents (for EUR) and returns a string with the
 * price in the appropriate format, ex: "5,50 €" or "11933 XPF"
 * based on the value of isNewCaledonianLocation
 * @param {number} priceInCents - price in euros (in cents)
 */

export const formatToFrenchDecimal = (
  priceInCents: number,
  currency: Currency,
  euroToXPFRate: number,
  options?: FormatPriceOptions
) => {
  const priceInEuros = priceInCents / CENTS_IN_EURO
  let price: number
  let unit: string
  let fractionDigits: number

  if (currency === Currency.FRANC_PACIFIQUE) {
    price = convertEuroToXPF(priceInEuros, euroToXPFRate)
    unit = Currency.FRANC_PACIFIQUE
    fractionDigits = 0
  } else {
    price = priceInEuros
    unit = Currency.EURO
    fractionDigits = options?.fractionDigits ?? (price === Math.floor(price) ? 0 : 2)
  }

  const formatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })

  return `${formatter.format(price)}\u00A0${unit}`
}

const getPricePerPlace = (
  prices: number[],
  currency: Currency,
  euroToXPFRate: number,
  options?: FormatPriceOptions
): string => {
  const uniquePrices = Array.from(new Set(prices.filter((p) => p > 0)))

  if (uniquePrices.length === 1)
    // @ts-expect-error: because of noUncheckedIndexedAccess
    return `${formatToFrenchDecimal(uniquePrices[0], currency, euroToXPFRate, options)}`

  const sortedPrices = [...uniquePrices].sort((a, b) => a - b)
  // @ts-expect-error: because of noUncheckedIndexedAccess
  return `Dès ${formatToFrenchDecimal(sortedPrices[0], currency, euroToXPFRate, options)}`
}

export const getDisplayPrice = (
  prices: number[] | undefined,
  currency: Currency,
  euroToXPFRate: number,
  options?: FormatPriceOptions
): string => {
  if (!prices || prices.length === 0) return ''
  if (prices.includes(0)) return 'Gratuit'
  return getPricePerPlace(prices, currency, euroToXPFRate, options)
}

export const formatPriceInEuroToDisplayPrice = (priceInEuro: number) =>
  formatToFrenchDecimal(convertEuroToCents(priceInEuro), Currency.FRANC_PACIFIQUE, 119.48)
