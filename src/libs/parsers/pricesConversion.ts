const CENTS_IN_EURO = 100

export enum RoundingMode {
  FLOORED = 'floored',
  NONE = 'none',
}

export const convertEuroToCents = (
  value: number,
  roundingMode: RoundingMode = RoundingMode.NONE
): number => {
  const result = value * CENTS_IN_EURO
  if (roundingMode === RoundingMode.FLOORED) return Math.floor(result)
  return Number(result.toFixed(2))
}

export const convertCentsToEuros = (
  value: number,
  roundingMode: RoundingMode = RoundingMode.NONE
): number => {
  const result = value / CENTS_IN_EURO
  if (roundingMode === RoundingMode.FLOORED) return Math.floor(result)
  return result
}
