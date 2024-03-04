import { SearchState, SearchView } from 'features/search/types'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { useNavigateToSearchWithVenueOffers } from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import * as useVenueSearchParameters from 'features/venue/helpers/useVenueSearchParameters'
import { LocationMode } from 'libs/location/types'
import { renderHook } from 'tests/utils'

const venueSearchParamsMock: SearchState = {
  beginningDatetime: undefined,
  endingDatetime: undefined,
  hitsPerPage: 30,
  locationFilter: {
    locationType: LocationMode.EVERYWHERE,
  },
  venue: {
    label: venueResponseSnap.publicName || '',
    info: venueResponseSnap.city || '',
    _geoloc: {
      lat: venueResponseSnap.latitude,
      lng: venueResponseSnap.longitude,
    },
    venueId: venueResponseSnap.id,
  },
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  isDigital: false,
  priceRange: [0, 300],
  tags: [],
  date: null,
  timeRange: null,
  view: SearchView.Landing,
  query: '',
}

jest
  .spyOn(useVenueSearchParameters, 'useVenueSearchParameters')
  .mockReturnValue(venueSearchParamsMock)

describe('useNavigateToSearchWithVenueOffers', () => {
  it('should give the config according to the venue', () => {
    const { result } = renderHook(() => useNavigateToSearchWithVenueOffers(venueResponseSnap))

    expect(result.current).toEqual({
      screen: 'TabNavigator',
      params: {
        screen: 'Search',
        params: {
          ...venueSearchParamsMock,
          view: SearchView.Results,
        },
      },
      withPush: true,
    })
  })
})
