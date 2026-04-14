import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

export enum RoundUnit {
  NONE = 0,
  UNITS = 1,
}

export const convertEuroToPacificFranc = (
  priceInEuro: number,
  rounding: RoundUnit = RoundUnit.NONE
): number => {
  let result = priceInEuro / DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
  result = Math.floor(result * 100) / 100

  if (rounding === RoundUnit.UNITS) result = Math.round(result / 5) * 5

  return result
}
