import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

export type FormatPriceOptions = {
  fractionDigits?: number
}

export const getDisplayedPrice = (
  prices: number[] | undefined,
  currency: Currency,
  euroToPacificFrancRate: number,
  formatDisplayedPrice = identityPrice,
  options?: FormatPriceOptions
): string => {
  if (!prices?.length) return ''
  if (prices.includes(0)) {
    return 'Gratuit'
  }

  const uniquePrices = Array.from(new Set(prices.filter((p) => p > 0)))

  const sortedPrices = [...uniquePrices].sort((a, b) => a - b)
  const firstPrice = sortedPrices[0]
  if (firstPrice !== undefined) {
    let displayedPrice = formatCurrencyFromCents(
      firstPrice,
      currency,
      euroToPacificFrancRate,
      options
    )
    displayedPrice = formatDisplayedPrice(displayedPrice)
    if (uniquePrices.length > 1) {
      displayedPrice = formatStartPrice(displayedPrice)
    }
    return displayedPrice
  }
  return ''
}

export const identityPrice = (price: string): string => price
export const formatDuoPrice = (price: string): string => `${price} • Duo`
export const formatStartPrice = (price: string): string => `Dès ${price}`
export const formatPrice = ({ isDuo }: { isDuo: boolean }) => {
  return isDuo ? formatDuoPrice : identityPrice
}
