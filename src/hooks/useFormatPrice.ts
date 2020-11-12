import { useCallback } from 'react'

const EURO_SYMBOL = '€'

const formatToFrenchDecimal = (value: number) =>
  `${value.toString().replace('.', ',')} ${EURO_SYMBOL}`

export const getDisplayPrice = (prices: number[] | undefined): string => {
  if (!prices || prices.length == 0) return ''
  if (prices.includes(0)) return 'Gratuit'

  const uniquePrices = Array.from(new Set(prices.filter((p) => p > 0)))
  if (uniquePrices.length === 1) return formatToFrenchDecimal(uniquePrices[0])
  return `Dès ${formatToFrenchDecimal(uniquePrices.sort()[0])}`
}

export const useFormatPrice = (): ((prices: number[] | undefined) => string) => {
  // Using a hook callback because it may depend on locale
  return useCallback(getDisplayPrice, [])
}
