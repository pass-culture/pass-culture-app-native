import { RoundUnit, convertEuroToPacificFranc } from 'shared/currency/convertEuroToPacificFranc'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

const convertPriceStringToNumber = (price: string): number => {
  return Number(price.trim().replaceAll(',', '.'))
}

const convertPriceNumberToString = (price: number): string => {
  return String(price).trim().replaceAll('.', ',')
}

export const convertEurosStringToCurrentCurrencyString = (
  priceInEuro: string,
  pacificFrancToEuroRate: number,
  currency: Currency,
  rounding: RoundUnit = RoundUnit.NONE
): string => {
  const priceInEuroNumber = convertPriceStringToNumber(priceInEuro)

  if (currency === Currency.PACIFIC_FRANC_SHORT || currency === Currency.PACIFIC_FRANC_FULL) {
    const priceInPacificFranc = convertEuroToPacificFranc(
      priceInEuroNumber,
      pacificFrancToEuroRate,
      rounding
    )
    return convertPriceNumberToString(priceInPacificFranc)
  }

  return convertPriceNumberToString(priceInEuroNumber)
}
