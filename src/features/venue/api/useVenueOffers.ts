import uniqBy from 'lodash.uniqby'
import { useQuery } from 'react-query'

import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { SearchState } from 'features/search/types'
import { useVenue } from 'features/venue/api/useVenue'
import { filterAlgoliaHit, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { fetchVenueOffers } from 'libs/search/fetch/search'

export const useVenueSearchParameters = (venueId: number): SearchState => {
  const { position } = useGeolocation()
  const { data: venue } = useVenue(venueId)

  const defaultLocationFilter = position
    ? { locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }
    : { locationType: LocationType.EVERYWHERE }

  const locationFilter = (venueId && venue
    ? {
        locationType: LocationType.VENUE,
        venue: {
          label: venue.name,
          info: venue.city,
          geolocation: { latitude: venue.latitude, longitude: venue.longitude },
          venueId,
        },
      }
    : defaultLocationFilter) as SearchState['locationFilter']

  const params: SearchState = {
    beginningDatetime: null,
    endingDatetime: null,
    hitsPerPage: 10,
    locationFilter,
    offerCategories: [],
    offerIsDuo: false,
    offerIsFree: false,
    offerIsNew: false,
    offerTypes: { isDigital: false, isEvent: false, isThing: false },
    priceRange: [0, 300],
    tags: [],
    date: null,
    timeRange: null,
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
