import { isSameDay } from 'date-fns'

import { OfferResponseV2, OffersStocksResponseV2 } from 'api/gen'

export const filterOffersStocksByDate = (
  offerWithStocks: OffersStocksResponseV2 = { offers: [] },
  date: Date
): OffersStocksResponseV2 => {
  const offersWithStocksFiltered: OfferResponseV2[] = offerWithStocks.offers.map((offer) => {
    return {
      ...offer,
      stocks: offer.stocks.filter((stock) => {
        return !!stock.beginningDatetime && isSameDay(new Date(stock.beginningDatetime), date)
      }),
    }
  })
  const offersWithMoviesFiltered = offersWithStocksFiltered.filter((offer) => !!offer.stocks.length)
  return { offers: offersWithMoviesFiltered }
}
