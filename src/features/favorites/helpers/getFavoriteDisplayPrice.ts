import { parseCurrencyFromCents } from 'libs/parsers/getDisplayPrice'

export const getFavoriteDisplayPrice = ({
  startPrice,
  price,
}: {
  startPrice?: number | null
  price?: number | null
}): string | undefined => {
  if (price === 0) return 'Gratuit'
  if (price && price > 0) return parseCurrencyFromCents(price)
  if (startPrice === 0 || (startPrice && startPrice > 0)) {
    return `Dès ${parseCurrencyFromCents(startPrice)}`
  }
  return undefined
}
