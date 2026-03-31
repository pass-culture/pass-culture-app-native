import { InfiniteData } from '@tanstack/react-query'
import { SearchResponse } from 'algoliasearch'

import { VenuesUserData } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOffer } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'

const SEARCH_FILTERS = ['Offres', 'Lieux', 'Artistes'] as const
export type SearchFilter = (typeof SEARCH_FILTERS)[number]

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

export type SelectSearchOffersParams = {
  data: InfiniteData<FetchSearchOffersResponse>
  transformHits: ReturnType<typeof useTransformOfferHits>
  selectedFilter: SearchFilter | null
}
