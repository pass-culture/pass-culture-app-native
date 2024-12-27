import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { RoundUnit, convertEuroToPacificFranc } from 'shared/currency/convertEuroToPacificFranc'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

export const formatCurrencyFromCentsWithoutCurrencySymbol = (
  priceInCents: number,
  currency: Currency,
  euroToPacificFrancRate: number
): number => {
  const priceInEuro = convertCentsToEuros(priceInCents)

  if (currency === Currency.PACIFIC_FRANC_SHORT || currency === Currency.PACIFIC_FRANC_FULL) {
    return convertEuroToPacificFranc(priceInEuro, euroToPacificFrancRate, RoundUnit.UNITS)
  }
  return Math.floor(priceInEuro * 100) / 100
}
