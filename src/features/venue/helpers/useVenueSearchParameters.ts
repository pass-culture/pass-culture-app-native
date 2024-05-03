import { VenueResponse } from 'api/gen'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'

export const useVenueSearchParameters = (dataVenue?: VenueResponse): SearchState => {
  const {
    searchState: { locationFilter },
  } = useSearch()
  const maxPrice = useMaxPrice()

  const venue = (
    dataVenue
      ? {
          label: dataVenue.publicName ?? dataVenue.name,
          info: dataVenue.city,
          geolocation: { latitude: dataVenue.latitude, longitude: dataVenue.longitude },
          venueId: dataVenue.id,
        }
      : undefined
  ) as SearchState['venue']

  const params: SearchState = {
    beginningDatetime: undefined,
    endingDatetime: undefined,
    hitsPerPage: 30,
    locationFilter,
    offerCategories: [],
    offerSubcategories: [],
    offerIsDuo: false,
    offerIsFree: false,
    isDigital: false,
    priceRange: [0, maxPrice],
    tags: [],
    date: null,
    timeRange: null,
    query: '',
    venue,
  }
  return params
}
