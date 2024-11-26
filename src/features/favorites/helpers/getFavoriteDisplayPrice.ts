import { parseCurrencyFromCents } from 'libs/parsers/parseCurrencyFromCents'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

export const getFavoriteDisplayPrice = ({
  currency,
  euroToPacificFrancRate,
  startPrice,
  price,
}: {
  currency: Currency
  euroToPacificFrancRate: number
  startPrice?: number | null
  price?: number | null
}): string | undefined => {
  if (price === 0) return 'Gratuit'
  if (price && price > 0) return parseCurrencyFromCents(price, currency, euroToPacificFrancRate)
  if (startPrice === 0 || (startPrice && startPrice > 0)) {
    return `Dès ${parseCurrencyFromCents(startPrice, currency, euroToPacificFrancRate)}`
  }
  return undefined
}
