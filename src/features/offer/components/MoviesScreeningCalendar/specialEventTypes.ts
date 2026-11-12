import { OfferForStocksResponse } from 'api/gen'

export type SpecialEventMovieOffer = {
  nextDate?: Date
  offer: OfferForStocksResponse
  isUpcoming: boolean
}
