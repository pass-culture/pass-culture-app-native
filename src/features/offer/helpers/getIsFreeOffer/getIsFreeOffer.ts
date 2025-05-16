import { OfferResponseV2 } from 'api/gen'

export const getIsFreeOffer = (offer: OfferResponseV2) =>
  !!offer.stocks.length && !offer.stocks.some((stock) => stock.price > 0)
