import { OfferResponseV2 } from 'api/gen'

export function getIsFreeDigitalOffer(offer?: OfferResponseV2) {
  return (offer?.isDigital && offer?.stocks[0]?.price === 0) ?? false
}
