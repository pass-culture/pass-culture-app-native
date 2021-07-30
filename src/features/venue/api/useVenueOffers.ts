import uniqBy from 'lodash.uniqby'
import { useQuery } from 'react-query'

import { LocationType } from 'features/search/enums'
import { SearchParameters } from 'features/search/types'
import { filterAlgoliaHit, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit, fetchVenueOffers } from 'libs/search'

export const useVenueOffers = (venueId: number) => {
  const { position } = useGeolocation()
  const transformHits = useTransformAlgoliaHits()

  const params: SearchParameters = {
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
    locationType: position ? LocationType.AROUND_ME : LocationType.EVERYWHERE,
    tags: [],
    date: null,
    timeRange: null,
  }

  return useQuery<SearchHit[]>([QueryKeys.VENUE_OFFERS, venueId], () => fetchVenueOffers(params), {
    select: (hits) => uniqBy(hits.filter(filterAlgoliaHit).map(transformHits), 'objectID'),
  })
}
