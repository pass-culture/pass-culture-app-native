import compose from 'lodash/fp/compose'

import { SubcategoryIdEnum } from 'api/gen'
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
    const displayedPrice = formatCurrencyFromCents(
      firstPrice,
      currency,
      euroToPacificFrancRate,
      options
    )
    return formatDisplayedPrice(displayedPrice)
  }
  return ''
}

export const identityPrice = (price: string): string => price
export const formatDuoPrice = (price: string): string => `${price} • Duo`
export const formatStartPrice = (price: string): string => `Dès ${price}`
export const formatPrice = ({ isFixed, isDuo }: { isFixed: boolean; isDuo: boolean }) => {
  return compose([
    isFixed ? identityPrice : formatStartPrice,
    isDuo ? formatDuoPrice : identityPrice,
  ])
}

export const getIfPricesShouldBeFixed = (
  subcategoryId?: SubcategoryIdEnum | undefined
): boolean => {
  return subcategoryId == SubcategoryIdEnum.LIVRE_PAPIER
}
