import { isSameDay } from 'date-fns'

import { OfferResponseV2, OffersStocksResponseV2 } from 'api/gen'

export const filterOffersStocks = (
  offersWithStocks: OffersStocksResponseV2,
  date: Date
): OffersStocksResponseV2 => {
  const offersWithStocksFiltered: OfferResponseV2[] = offersWithStocks.offers
    .map((offer) => {
      return {
        ...offer,
        stocks: offer.stocks.filter((stock) => {
          return !!stock.beginningDatetime && isSameDay(new Date(stock.beginningDatetime), date)
        }),
      }
    })
    .sort((a, b) => {
      const aValue = a.last30DaysBookings
      const bValue = b.last30DaysBookings

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      return bValue - aValue
    })

  const offersWithMoviesFiltered = offersWithStocksFiltered.filter((offer) => !!offer.stocks.length)
  return { offers: offersWithMoviesFiltered }
}
