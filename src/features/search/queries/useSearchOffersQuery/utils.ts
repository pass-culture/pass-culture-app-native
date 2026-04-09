import { flatten, uniqBy } from 'lodash'

import { mapAlgoliaVenueToVenue } from 'features/search/queries/useSearchOffersQuery/helpers/mapAlgoliaVenueToVenue'
import {
  FetchSearchOffersResponse,
  SelectSearchOffersParams,
} from 'features/search/queries/useSearchOffersQuery/types'
import { AlgoliaOffer } from 'libs/algolia/types'

export const getFlattenHits = (
  pages: FetchSearchOffersResponse[],
  transformHits: SelectSearchOffersParams['transformHits'],
  type: 'offersResponse' | 'duplicatedOffersResponse'
) => {
  return flatten(pages.flatMap((page) => page[type].hits).map((offer) => transformHits(offer)))
}

export const getLastPage = (pages: FetchSearchOffersResponse[]) => pages.at(-1)

export const getNbHits = (firstPage?: FetchSearchOffersResponse, flattenedOffersLength = 0) =>
  firstPage?.offersResponse.nbHits ?? flattenedOffersLength

export const getUniqueVenues = (duplicatedOffers: AlgoliaOffer[]) => {
  const offerVenues = duplicatedOffers.map((hit) => mapAlgoliaVenueToVenue(hit.venue, hit._geoloc))
  return uniqBy(offerVenues, 'venueId')
}

export const getUserData = (firstPage?: FetchSearchOffersResponse) =>
  firstPage?.offersResponse.userData
