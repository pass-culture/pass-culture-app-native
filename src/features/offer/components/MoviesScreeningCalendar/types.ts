import { OfferForStocksResponse } from 'api/gen'

export type MovieOffer = {
  nextDate?: Date
  offer: OfferForStocksResponse
  isUpcoming: boolean
}
