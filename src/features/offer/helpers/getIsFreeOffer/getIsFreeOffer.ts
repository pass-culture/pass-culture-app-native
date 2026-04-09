import { OfferResponse } from 'api/gen'

// An offer is considered free if it contains stocks and they at lease one is free
export const getIsFreeOffer = (offer: OfferResponse): boolean =>
  !!offer.stocks.length && offer.stocks.some((stock) => stock.price === 0)
