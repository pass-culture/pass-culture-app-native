import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

export type FormatPriceOptions = {
  fractionDigits?: number
}

export const getDisplayedPrice = (
  prices: number[] | undefined,
  currency: Currency,
  euroToPacificFrancRate: number,
  isDuoDisplayable?: boolean,
  options?: FormatPriceOptions
): string => {
  if (prices?.length) {
    if (prices.includes(0)) {
      return 'Gratuit'
    }

    const uniquePrices = Array.from(new Set(prices.filter((p) => p > 0)))

    const sortedPrices = [...uniquePrices].sort((a, b) => a - b)
    const firstPrice = sortedPrices[0]
    if (firstPrice !== undefined) {
      const displayedPrice = `Dès ${formatCurrencyFromCents(firstPrice, currency, euroToPacificFrancRate, options)}`
      return isDuoDisplayable ? `${displayedPrice} - Duo` : displayedPrice
    }
  }
  return ''
}
