import { isSameDay } from 'date-fns'

import {
  NewOfferPreviewResponse,
  NewOffersStocksResponse,
} from 'features/offer/api/useOffersStocks'

export const filterOffersStocksByDate = (
  offerWithStocks: NewOffersStocksResponse = { offers: [] },
  date: Date
): NewOffersStocksResponse => {
  const offersWithStocksFiltered: NewOfferPreviewResponse[] = offerWithStocks.offers.map(
    (offer) => {
      return {
        ...offer,
        stocks: offer.stocks.filter((stock) => {
          return !!stock.beginningDatetime && isSameDay(new Date(stock.beginningDatetime), date)
        }),
      }
    }
  )
  const offersWithMoviesFiltered = offersWithStocksFiltered.filter((offer) => !!offer.stocks.length)
  return { offers: offersWithMoviesFiltered }
}
