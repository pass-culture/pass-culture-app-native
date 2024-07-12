import { isSameDay } from 'date-fns'

import { OfferResponseV2, OffersStocksResponseV2 } from 'api/gen'

export const filterOffersStocks = (
  offersWithStocks: OffersStocksResponseV2,
  date: Date
): OffersStocksResponseV2 => {
  const specifiedDayOffers = getOffersByDate(offersWithStocks, date)
  const offersSortedByLast30DaysBooking = sortByLast30DaysBooking(specifiedDayOffers)

  return { offers: offersSortedByLast30DaysBooking }
}

const sortByLast30DaysBooking = (offersWithStocks: OfferResponseV2[]) => {
  return offersWithStocks
    .sort((a, b) => {
      const aValue = a.last30DaysBookings
      const bValue = b.last30DaysBookings

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      return bValue - aValue
    })
    .filter((offer) => !!offer.stocks.length)
}

const getOffersByDate = (
  offersWithStocks: OffersStocksResponseV2,
  date: Date
): OfferResponseV2[] => {
  return offersWithStocks.offers.map((offer) => {
    return {
      ...offer,
      stocks: offer.stocks.filter((stock) => {
        return !!stock.beginningDatetime && isSameDay(new Date(stock.beginningDatetime), date)
      }),
    }
  })
}
