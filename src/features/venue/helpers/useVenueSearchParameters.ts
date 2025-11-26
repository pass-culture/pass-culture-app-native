import { useMemo } from 'react'

import { VenueResponse } from 'api/gen'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'

export const useVenueSearchParameters = (
  dataVenue?: Omit<VenueResponse, 'isVirtual'>
): SearchState => {
  const {
    searchState: { locationFilter },
  } = useSearch()
  const maxPriceInCents = useMaxPrice()

  const venue = useMemo(
    () =>
      (dataVenue
        ? {
            label: dataVenue.name,
            info: dataVenue.city,
            geolocation: { latitude: dataVenue.latitude, longitude: dataVenue.longitude },
            venueId: dataVenue.id,
          }
        : undefined) as SearchState['venue'],
    [dataVenue]
  )

  return useMemo(
    () => ({
      beginningDatetime: undefined,
      endingDatetime: undefined,
      hitsPerPage: 50,
      locationFilter,
      offerCategories: [],
      offerSubcategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      isDigital: false,
      priceRange: [0, convertCentsToEuros(maxPriceInCents)],
      tags: [],
      date: null,
      timeRange: null,
      query: '',
      venue,
    }),
    [locationFilter, maxPriceInCents, venue]
  )
}
