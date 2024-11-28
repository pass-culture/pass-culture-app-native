import { useGetPacificFrancToEuroRate } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { formatCurrencyFromCents } from 'libs/parsers/formatCurrencyFromCents'
import { Currency, useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'

export type FormatPriceOptions = {
  fractionDigits?: number
}

const getPricePerPlace = (
  prices: number[],
  currency: Currency,
  euroToPacificFrancRate: number,
  options?: FormatPriceOptions
): string => {
  const uniquePrices = Array.from(new Set(prices.filter((p) => p > 0)))
  if (uniquePrices.length === 1) {
    const uniquePrice = uniquePrices[0]
    if (uniquePrice !== undefined) {
      return `${formatCurrencyFromCents(uniquePrice, currency, euroToPacificFrancRate, options)}`
    }
  }

  const sortedPrices = [...uniquePrices].sort((a, b) => a - b)
  const firstPrice = sortedPrices[0]
  if (firstPrice !== undefined) {
    return `Dès ${formatCurrencyFromCents(firstPrice, currency, euroToPacificFrancRate, options)}`
  }

  return ''
}

export const getDisplayPrice = (
  prices: number[] | undefined,
  currency: Currency,
  euroToPacificFrancRate: number,
  options?: FormatPriceOptions
): string => {
  if (!prices || prices.length === 0) return ''
  if (prices.includes(0)) return 'Gratuit'
  return getPricePerPlace(prices, currency, euroToPacificFrancRate, options)
}

export const useGetDisplayPrice = (
  prices: number[] | undefined,
  options?: FormatPriceOptions
): string => {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  return getDisplayPrice(prices, currency, euroToPacificFrancRate, options)
}
