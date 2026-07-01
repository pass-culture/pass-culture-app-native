export const convertEuroToCents = (value: number): number => Number((value * 100).toFixed(2))

export const convertCentsToEuros = (value: number): number => value / 100
