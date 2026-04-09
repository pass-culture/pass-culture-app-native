import { OfferResponse } from 'api/gen'

export function getIsFreeDigitalOffer(offer?: Pick<OfferResponse, 'isDigital' | 'stocks'>) {
  return (offer?.isDigital && offer?.stocks[0]?.price === 0) ?? false
}
