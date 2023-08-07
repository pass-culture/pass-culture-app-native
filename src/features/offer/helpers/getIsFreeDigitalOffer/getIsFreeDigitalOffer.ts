import { OfferResponse } from 'api/gen'

export function getIsFreeDigitalOffer(offer?: OfferResponse) {
  return (offer?.isDigital && offer?.stocks[0]?.price === 0) ?? false
}
