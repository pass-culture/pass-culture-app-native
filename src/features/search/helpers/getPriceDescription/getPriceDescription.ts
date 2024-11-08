import { parseCurrencyFromCents } from 'libs/parsers/getDisplayPrice'
import { convertEuroToCents } from 'libs/parsers/pricesConversion'

export const getPriceDescription = (minPriceInEuro?: number, maxPriceInEuro?: number) => {
  if (
    (minPriceInEuro === 0 && maxPriceInEuro === 0) ||
    (minPriceInEuro === undefined && maxPriceInEuro === 0)
  ) {
    return 'Gratuit'
  }

  if (minPriceInEuro && minPriceInEuro > 0 && maxPriceInEuro && maxPriceInEuro > 0) {
    return `de ${parseCurrencyFromCents(convertEuroToCents(minPriceInEuro))} à ${parseCurrencyFromCents(convertEuroToCents(maxPriceInEuro))}`
  }

  if (minPriceInEuro && minPriceInEuro >= 0) {
    return `${parseCurrencyFromCents(convertEuroToCents(minPriceInEuro))} et plus`
  }

  if (maxPriceInEuro && maxPriceInEuro >= 0) {
    return `${parseCurrencyFromCents(convertEuroToCents(maxPriceInEuro))} et moins`
  }

  return ''
}
