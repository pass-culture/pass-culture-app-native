import { InfiniteData } from '@tanstack/react-query'
import { flatten, uniqBy } from 'lodash'

import { mapAlgoliaVenueToVenue } from 'features/search/queries/useSearchOffersQuery/helpers/mapAlgoliaVenueToVenue'
import {
  FetchSearchOffersResponse,
  SelectedSearchOffers,
} from 'features/search/queries/useSearchOffersQuery/types'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'

type SelectSearchOffersParams = {
  data: InfiniteData<FetchSearchOffersResponse>
  transformHits: ReturnType<typeof useTransformOfferHits>
}

export const selectSearchOffers = ({
  data,
  transformHits,
}: SelectSearchOffersParams): SelectedSearchOffers => {
  const { pages } = data

  const flattenOffers = flatten(
    pages.flatMap((page) => page.offersResponse.hits).map(transformHits)
  )

  const flattenDuplicatedOffers = flatten(
    pages.flatMap((page) => page.duplicatedOffersResponse.hits.map(transformHits))
  )

  const offerVenues = flattenDuplicatedOffers.map((hit) =>
    mapAlgoliaVenueToVenue(hit.venue, hit._geoloc)
  )

  const [lastPage] = pages.slice(-1)

  return {
    duplicatedOffers: flattenDuplicatedOffers,
    lastPage,
    nbHits: pages[0]?.offersResponse.nbHits ?? flattenOffers.length,
    offers: flattenOffers,
    offerVenues: uniqBy(offerVenues, 'id'),
    userData: pages[0]?.offersResponse.userData,
  }
}
