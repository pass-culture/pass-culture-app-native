export enum RoundUnit {
  NONE = 0,
  UNITS = 1,
  TENS = 10,
  HUNDREDS = 100,
}

export const convertEuroToCFP = (
  priceInEuro: number,
  euroToCPFRate: number,
  rounding: RoundUnit = RoundUnit.NONE
): number => {
  const cfpValue = priceInEuro * euroToCPFRate
  if (rounding === RoundUnit.NONE) {
    const result = parseFloat(cfpValue.toFixed(2))
    return result % 1 === 0 ? Number(result.toFixed(0)) : Number(result.toFixed(2))
  }
  return Math.ceil(cfpValue / rounding) * rounding
}
