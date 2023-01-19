import { formatToFrenchDecimal } from 'libs/parsers'

export const getFavoriteDisplayPrice = ({
  startPrice,
  price,
}: {
  startPrice?: number | null
  price?: number | null
}): string | undefined => {
  if (price === 0) return 'Gratuit'
  if (price && price > 0) return formatToFrenchDecimal(price)
  if (startPrice === 0 || (startPrice && startPrice > 0)) {
    return `Dès ${formatToFrenchDecimal(startPrice)}`
  }
  return undefined
}
