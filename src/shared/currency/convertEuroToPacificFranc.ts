export enum RoundUnit {
  NONE = 0,
  UNITS = 1,
}

export const convertCurrency = (
  amount: number,
  rate: number,
  rounding: RoundUnit = RoundUnit.NONE
): number => {
  const result = Math.floor((amount / rate) * 100) / 100
  return rounding === RoundUnit.UNITS ? Math.round(result / 5) * 5 : result
}
