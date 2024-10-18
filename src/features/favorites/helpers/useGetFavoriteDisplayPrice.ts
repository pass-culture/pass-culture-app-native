import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { useGetCurrentCurrency } from 'libs/parsers/useGetCurrentCurrency'
import { useGetEuroToXPFRate } from 'libs/parsers/useGetEuroToXPFRate'

export const useGetFavoriteDisplayPrice = ({
  startPrice,
  price,
}: {
  startPrice?: number | null
  price?: number | null
}): string | undefined => {
  const currency = useGetCurrentCurrency()
  const euroToXPFRate = useGetEuroToXPFRate()

  if (price === 0) return 'Gratuit'
  if (price && price > 0) return formatToFrenchDecimal(price, currency, euroToXPFRate)
  if (startPrice === 0 || (startPrice && startPrice > 0)) {
    return `Dès ${formatToFrenchDecimal(startPrice, currency, euroToXPFRate)}`
  }
  return undefined
}
