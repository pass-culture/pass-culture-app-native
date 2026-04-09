import { Offer } from 'shared/offer/types'

export type FetchSearchArtistsResponse = {
  offerArtistsResponse: { hits: Offer[] }
}
