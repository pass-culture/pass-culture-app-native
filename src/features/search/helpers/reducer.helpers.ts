import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { Range } from 'libs/typesUtils/typeHelpers'

const MIN_PRICE = 0
export const MAX_PRICE_IN_CENTS = 300_00
export const MAX_RADIUS = 100

export const clampPrice = (priceRange: Range<number> | null | undefined): Range<number> => {
  if (!priceRange) return [MIN_PRICE, convertCentsToEuros(MAX_PRICE_IN_CENTS)]
  const min = Math.max(MIN_PRICE, priceRange[0])
  const max = Math.min(convertCentsToEuros(MAX_PRICE_IN_CENTS), priceRange[1])
  return [min, max]
}
