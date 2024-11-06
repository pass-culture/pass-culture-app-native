export enum RoundUnit {
  NONE = 0,
  UNITS = 1,
}

export const convertEuroToPacificFranc = (
  priceInEuro: number,
  pacificFrancToEuroRate: number,
  rounding: RoundUnit = RoundUnit.NONE
): number => {
  let result = priceInEuro / pacificFrancToEuroRate
  result = Math.floor(result * 100) / 100

  if (rounding === RoundUnit.UNITS) result = Math.ceil(result)
  return result
}
