import { SearchResponse } from 'algoliasearch'

import { VenuesUserData } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { AlgoliaOffer } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'

export type FetchSearchOffersResponse = {
  offersResponse: {
    hits: AlgoliaOffer[]
    nbHits: number
    userData?: VenuesUserData | null
    nbPages: number
    page: number
  }
  duplicatedOffersResponse: { hits: AlgoliaOffer[]; nbHits: number }
}

export type SelectedSearchOffers = {
  duplicatedOffers: Offer[]
  lastPage: FetchSearchOffersResponse | undefined
  nbHits: number
  offers: Offer[]
  offerVenues: Venue[]
  userData: SearchResponse<Offer[]>['userData']
}
