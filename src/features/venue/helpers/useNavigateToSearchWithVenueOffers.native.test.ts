import { SearchState } from 'features/search/types'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
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
    label: venueDataTest.publicName || '',
    info: venueDataTest.city || '',
    _geoloc: {
      lat: venueDataTest.latitude,
      lng: venueDataTest.longitude,
    },
    venueId: venueDataTest.id,
    isOpenToPublic: true,
    activity: venueDataTest.activity,
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
  query: '',
}

jest
  .spyOn(useVenueSearchParameters, 'useVenueSearchParameters')
  .mockReturnValue(venueSearchParamsMock)

jest.mock('libs/firebase/analytics/analytics')

describe('useNavigateToSearchWithVenueOffers', () => {
  it('should give the config according to the venue', () => {
    const { result } = renderHook(() => useNavigateToSearchWithVenueOffers(venueDataTest))

    expect(result.current).toEqual({
      screen: 'TabNavigator',
      params: {
        screen: 'SearchStackNavigator',
        params: {
          screen: 'SearchResults',
          params: {
            ...venueSearchParamsMock,
          },
        },
      },
      withPush: true,
    })
  })
})
