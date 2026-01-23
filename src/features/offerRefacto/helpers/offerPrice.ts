import { OfferResponseV2 } from 'api/gen'

export const getAllPrices = (offerStocks: OfferResponseV2['stocks']): number[] => {
  const bookableStocks = offerStocks.filter(({ isBookable }) => isBookable)
  const stocks = bookableStocks.length > 0 ? bookableStocks : offerStocks
  return stocks.map(({ price }) => price)
}

export const getPrice = (stocks: OfferResponseV2['stocks']): number =>
  Math.min(...getAllPrices(stocks))

export function getIsFreeDigitalOffer(offer?: Pick<OfferResponseV2, 'isDigital' | 'stocks'>) {
  return (offer?.isDigital && offer?.stocks[0]?.price === 0) ?? false
}

// An offer is considered free if it contains stocks and they at lease one is free
export const getIsFreeOffer = (offer: OfferResponseV2): boolean =>
  !!offer.stocks.length && offer.stocks.some((stock) => stock.price === 0)
