import { OfferResponse } from 'api/gen'

export const getAllPrices = (offerStocks: OfferResponse['stocks']): number[] => {
  const bookableStocks = offerStocks.filter(({ isBookable }) => isBookable)
  const stocks = bookableStocks.length > 0 ? bookableStocks : offerStocks
  return stocks.map(({ price }) => price)
}

export const getPrice = (stocks: OfferResponse['stocks']): number =>
  Math.min(...getAllPrices(stocks))

export function getIsFreeDigitalOffer(offer?: Pick<OfferResponse, 'isDigital' | 'stocks'>) {
  return (offer?.isDigital && offer?.stocks[0]?.price === 0) ?? false
}

// An offer is considered free if it contains stocks and they at lease one is free
export const getIsFreeOffer = (offer: OfferResponse): boolean =>
  !!offer.stocks.length && offer.stocks.some((stock) => stock.price === 0)
