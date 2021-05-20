export const CENTS_IN_EURO = 100

export const convertEuroToCents = (p: number): number => Math.floor(p * CENTS_IN_EURO)

export const convertCentsToEuros = (p: number): number => Math.floor(p / CENTS_IN_EURO)
