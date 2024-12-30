import { convertEuroToCents } from 'libs/parsers/pricesConversion'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
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
    return `de ${formatCurrencyFromCents(convertEuroToCents(minPriceInEuro), currency, euroToPacificFrancRate)} à ${formatCurrencyFromCents(convertEuroToCents(maxPriceInEuro), currency, euroToPacificFrancRate)}`
  }

  if (minPriceInEuro && minPriceInEuro >= 0) {
    return `${formatCurrencyFromCents(convertEuroToCents(minPriceInEuro), currency, euroToPacificFrancRate)} et plus`
  }

  if (maxPriceInEuro && maxPriceInEuro >= 0) {
    return `${formatCurrencyFromCents(convertEuroToCents(maxPriceInEuro), currency, euroToPacificFrancRate)} et moins`
  }

  return ''
}
