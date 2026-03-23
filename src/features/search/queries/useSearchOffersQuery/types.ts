import { VenuesUserData } from 'features/search/types'
import { AlgoliaOffer } from 'libs/algolia/types'

export type FetchSearchOffersResponse = {
  offersResponse: { hits: AlgoliaOffer[]; nbHits: number; userData?: VenuesUserData | null }
  duplicatedOffersResponse: { hits: AlgoliaOffer[]; nbHits: number }
}
