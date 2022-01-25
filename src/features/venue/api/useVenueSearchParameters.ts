import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { SearchState } from 'features/search/types'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { useVenue } from 'features/venue/api/useVenue'
import { useGeolocation } from 'libs/geolocation'

export const useVenueSearchParameters = (venueId: number): SearchState => {
  const { position } = useGeolocation()
  const { data: venue } = useVenue(venueId)
  const maxPrice = useMaxPrice()

  const defaultLocationFilter = position
    ? { locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }
    : { locationType: LocationType.EVERYWHERE }

  const locationFilter = (
    venueId && venue
      ? {
          locationType: LocationType.VENUE,
          venue: {
            label: venue.publicName || venue.name,
            info: venue.city,
            geolocation: { latitude: venue.latitude, longitude: venue.longitude },
            venueId,
          },
        }
      : defaultLocationFilter
  ) as SearchState['locationFilter']

  const params: SearchState = {
    beginningDatetime: null,
    endingDatetime: null,
    hitsPerPage: 10,
    locationFilter,
    offerCategories: [],
    offerSubcategories: [],
    offerIsDuo: false,
    offerIsFree: false,
    offerIsNew: false,
    offerTypes: { isDigital: false, isEvent: false, isThing: false },
    priceRange: [0, maxPrice],
    tags: [],
    date: null,
    timeRange: null,
    showResults: false,
    query: '',
  }

  return params
}
