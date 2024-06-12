import { OfferResponseV2 } from 'api/gen'

export function getIsFreeDigitalOffer(offer?: Pick<OfferResponseV2, 'isDigital' | 'stocks'>) {
  return (offer?.isDigital && offer?.stocks[0]?.price === 0) ?? false
}
