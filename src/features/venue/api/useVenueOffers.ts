import uniqBy from 'lodash.uniqby'
import { useQuery } from 'react-query'

import { LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { filterAlgoliaHit, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { fetchVenueOffers } from 'libs/search/fetch/search'

export const useVenueSearchParameters = (venueId: number): SearchState => {
  const { position } = useGeolocation()

  const params: SearchState = {
    aroundRadius: position ? 100 : null,
    beginningDatetime: null,
    endingDatetime: null,
    geolocation: position ? { latitude: position.latitude, longitude: position.longitude } : null,
    hitsPerPage: 10,
    offerCategories: [],
    offerIsDuo: false,
    offerIsFree: false,
    offerIsNew: false,
    offerTypes: { isDigital: false, isEvent: false, isThing: false },
    priceRange: [0, 300],
    place: null,
    locationType: LocationType.EVERYWHERE,
    tags: [],
    date: null,
    timeRange: null,
    venueId,
    showResults: false,
    query: '',
  }

  return params
}

export const useVenueOffers = (venueId: number) => {
  const transformHits = useTransformAlgoliaHits()
  const params = useVenueSearchParameters(venueId)

  return useQuery([QueryKeys.VENUE_OFFERS, venueId], () => fetchVenueOffers(params), {
    select: ({ hits, nbHits }) => ({
      hits: uniqBy(hits.filter(filterAlgoliaHit).map(transformHits), 'objectID'),
      nbHits,
    }),
  })
}
