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
  isDuoDisplayable?: boolean,
  options?: FormatPriceOptions,
  isPricefix?: boolean
): string => {
  if (prices?.length) {
    if (prices.includes(0)) {
      return 'Gratuit'
    }

    const uniquePrices = Array.from(new Set(prices.filter((p) => p > 0)))
    const sortedPrices = [...uniquePrices].sort((a, b) => a - b)
    const firstPrice = sortedPrices[0]
    if (firstPrice !== undefined) {
      const priceWithoutPrefix = formatCurrencyFromCents(
        firstPrice,
        currency,
        euroToPacificFrancRate,
        options
      )

      const displayedPrice = isPricefix ? priceWithoutPrefix : `Dès ${priceWithoutPrefix}`

      return isDuoDisplayable ? `${displayedPrice} - Duo` : displayedPrice
    }
  }
  return ''
}

export const getIfPricesShouldBeFix = (subcategoryId: SubcategoryIdEnum): boolean => {
  return subcategoryId == SubcategoryIdEnum.LIVRE_PAPIER
}
