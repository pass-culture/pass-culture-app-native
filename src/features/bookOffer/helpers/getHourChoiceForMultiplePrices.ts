import { OfferStockResponse } from 'api/gen'
import {
  getHourWording,
  getSortedHoursFromDate,
  getStockSortedByPriceFromHour,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { getFormattedHour } from 'features/bookOffer/helpers/getFormattedHour'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'

export const getHourChoiceForMultiplePrices = (
  stocks: OfferStockResponse[],
  selectedDate: string | undefined,
  offerCredit: number,
  currency: Currency,
  euroToPacificFrancRate: number
): Array<RadioButtonGroupOption> => {
  const sortedHoursFromDate = getSortedHoursFromDate(stocks, selectedDate)
  const distinctHours: string[] = [...new Set(sortedHoursFromDate)]

  return distinctHours.map((hour) => {
    const filteredAvailableStocksFromHour = getStockSortedByPriceFromHour(stocks, hour)
    const filteredAvailableStocksFromHourBookable = filteredAvailableStocksFromHour.filter(
      (stock) => stock.isBookable
    )
    const stocksToGetMinPrice =
      filteredAvailableStocksFromHourBookable.length > 0
        ? filteredAvailableStocksFromHourBookable
        : filteredAvailableStocksFromHour
    const minPriceStock = stocksToGetMinPrice.reduce(
      (acc, curr) => {
        if (acc.price < curr.price) return acc
        return curr
      },
      stocksToGetMinPrice[0] || { price: Infinity, features: [] }
    )

    const isBookable = filteredAvailableStocksFromHourBookable.length > 0
    const hasSeveralPrices = filteredAvailableStocksFromHour.length > 1
    const enoughCredit = minPriceStock.price <= offerCredit
    const priceWording = getHourWording(
      minPriceStock.price,
      isBookable,
      enoughCredit,
      currency,
      euroToPacificFrancRate,
      hasSeveralPrices
    )
    const joinedFeatures = minPriceStock.features.join(' ')

    return {
      key: hour,
      label: getFormattedHour(hour),
      description: [joinedFeatures, priceWording].filter(Boolean).join(' - '),
      disabled: !isBookable || !enoughCredit,
    }
  })
}
