import { OfferResponseV2 } from 'api/gen'

export type MovieOffer = {
  nextDate?: Date
  offer: OfferResponseV2
  isUpcoming: boolean
}
