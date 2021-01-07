import { OfferAdaptedResponse } from '../api/useOffer'

export const getOfferPrices = (offerStocks: OfferAdaptedResponse['stocks']): number[] => {
  const bookableStocks = offerStocks.filter(({ isBookable }) => isBookable)
  const stocks = bookableStocks.length > 0 ? bookableStocks : offerStocks
  return stocks.map(({ price }) => price)
}

export const getOfferPrice = (stocks: OfferAdaptedResponse['stocks']): number =>
  Math.min(...getOfferPrices(stocks))
