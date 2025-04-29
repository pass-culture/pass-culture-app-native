import { OfferResponseV2 } from 'api/gen'

export function getIsFreeOffer(offer: OfferResponseV2): boolean {
  const price = offer.stocks[0]?.price
  if (price === 0) return true
  return false
}
