import { parseCurrencyFromCents } from 'libs/parsers/parseCurrencyFromCents'
import { convertEuroToCents } from 'libs/parsers/pricesConversion'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

export const getPriceDescription = (
  currency: Currency,
  euroToPacificFrancRate: number,
  minPriceInEuro?: number,
  maxPriceInEuro?: number
) => {
  if (
    (minPriceInEuro === 0 && maxPriceInEuro === 0) ||
    (minPriceInEuro === undefined && maxPriceInEuro === 0)
  ) {
    return 'Gratuit'
  }

  if (minPriceInEuro && minPriceInEuro > 0 && maxPriceInEuro && maxPriceInEuro > 0) {
    return `de ${parseCurrencyFromCents(convertEuroToCents(minPriceInEuro), currency, euroToPacificFrancRate)} à ${parseCurrencyFromCents(convertEuroToCents(maxPriceInEuro), currency, euroToPacificFrancRate)}`
  }

  if (minPriceInEuro && minPriceInEuro >= 0) {
    return `${parseCurrencyFromCents(convertEuroToCents(minPriceInEuro), currency, euroToPacificFrancRate)} et plus`
  }

  if (maxPriceInEuro && maxPriceInEuro >= 0) {
    return `${parseCurrencyFromCents(convertEuroToCents(maxPriceInEuro), currency, euroToPacificFrancRate)} et moins`
  }

  return ''
}
