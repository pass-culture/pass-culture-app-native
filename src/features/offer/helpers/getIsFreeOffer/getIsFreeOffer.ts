import { OfferResponseV2 } from 'api/gen'

// Une offre est considérée gratuite si elle contient des stocks et qu'ils sont tous gratuits
export const getIsFreeOffer = (offer: OfferResponseV2): boolean =>
  !!offer.stocks.length && !offer.stocks.some((stock) => stock.price > 0)
