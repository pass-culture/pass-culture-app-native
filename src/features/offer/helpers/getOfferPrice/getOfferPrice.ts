import { OfferResponseV2 } from 'api/gen'

export const getOfferPrices = (offerStocks: OfferResponseV2['stocks']): number[] => {
  const bookableStocks = offerStocks.filter(({ isBookable }) => isBookable)
  const stocks = bookableStocks.length > 0 ? bookableStocks : offerStocks
  return stocks.map(({ price }) => price)
}

export const getOfferPrice = (stocks: OfferResponseV2['stocks']): number =>
  Math.min(...getOfferPrices(stocks))
