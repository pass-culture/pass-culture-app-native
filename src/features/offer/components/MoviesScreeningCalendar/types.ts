import { OfferResponse } from 'api/gen'

export type MovieOffer = {
  nextDate?: Date
  offer: OfferResponse
  isUpcoming: boolean
}
