import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState, SearchView } from 'features/search/types'
import { useVenue } from 'features/venue/api/useVenue'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'

export const useVenueSearchParameters = (venueId: number): SearchState => {
  const { geolocPosition } = useLocation()
  const { data: dataVenue } = useVenue(venueId)
  const maxPrice = useMaxPrice()

  const defaultLocationFilter = geolocPosition
    ? { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS }
    : { locationType: LocationMode.EVERYWHERE }

  const venue = (
    venueId && !!dataVenue
      ? {
          label: dataVenue.publicName ?? dataVenue.name,
          info: dataVenue.city,
          geolocation: { latitude: dataVenue.latitude, longitude: dataVenue.longitude },
          venueId,
        }
      : undefined
  ) as SearchState['venue']

  const params: SearchState = {
    beginningDatetime: undefined,
    endingDatetime: undefined,
    hitsPerPage: 30,
    locationFilter: defaultLocationFilter as SearchState['locationFilter'],
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
    view: SearchView.Landing,
    query: '',
    venue,
  }
  return params
}
