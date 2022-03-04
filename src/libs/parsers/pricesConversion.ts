export const CENTS_IN_EURO = 100

export const convertEuroToCents = (p: number): number => {
  return Math.floor(Number((p * CENTS_IN_EURO).toFixed(2)))
}

export const convertCentsToEuros = (p: number): number => Math.floor(p / CENTS_IN_EURO)
