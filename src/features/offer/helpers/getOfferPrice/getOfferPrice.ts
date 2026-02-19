import { OfferResponse } from 'api/gen'

export const getOfferPrices = (offerStocks: OfferResponse['stocks']): number[] => {
  const bookableStocks = offerStocks.filter(({ isBookable }) => isBookable)
  const stocks = bookableStocks.length > 0 ? bookableStocks : offerStocks
  return stocks.map(({ price }) => price)
}

export const getOfferPrice = (stocks: OfferResponse['stocks']): number =>
  Math.min(...getOfferPrices(stocks))
