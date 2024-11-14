export const CENTS_IN_EURO = 100

export const convertEuroToCents = (value: number): number => {
  return Math.floor(Number((value * CENTS_IN_EURO).toFixed(2)))
}

export const convertCentsToEuros = (value: number): number => {
  return Math.floor(value / CENTS_IN_EURO)
}
