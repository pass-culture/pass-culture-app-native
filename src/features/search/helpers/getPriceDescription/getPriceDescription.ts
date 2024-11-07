import { parseCurrency } from 'libs/parsers/getDisplayPrice'

export const getPriceDescription = (minPrice?: number, maxPrice?: number) => {
  if ((minPrice === 0 && maxPrice === 0) || (minPrice === undefined && maxPrice === 0)) {
    return 'Gratuit'
  }

  if (minPrice && minPrice > 0 && maxPrice && maxPrice > 0) {
    return `de ${parseCurrency(minPrice)} à ${parseCurrency(maxPrice)}`
  }

  if (minPrice && minPrice >= 0) {
    return `${parseCurrency(minPrice)} et plus`
  }

  if (maxPrice && maxPrice >= 0) {
    return `${parseCurrency(maxPrice)} et moins`
  }

  return ''
}
