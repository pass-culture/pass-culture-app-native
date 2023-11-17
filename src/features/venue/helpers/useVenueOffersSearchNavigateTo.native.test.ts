import { LocationType } from 'features/search/enums'
import { SearchState, SearchView } from 'features/search/types'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { useVenueOffersSearchNavigateTo } from 'features/venue/helpers/useVenueOffersSearchNavigateTo'
import * as useVenueSearchParameters from 'features/venue/helpers/useVenueSearchParameters/useVenueSearchParameters'
import { renderHook } from 'tests/utils'

const venueSearchParamsMock: SearchState = {
  beginningDatetime: undefined,
  endingDatetime: undefined,
  hitsPerPage: 30,
  locationFilter: {
    locationType: LocationType.VENUE,
    venue: {
      label: venueResponseSnap.publicName || '',
      info: venueResponseSnap.city || '',
      _geoloc: {
        lat: venueResponseSnap.latitude,
        lng: venueResponseSnap.longitude,
      },
      venueId: venueResponseSnap.id,
    },
  },
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  offerIsNew: false,
  offerTypes: { isDigital: false, isEvent: false, isThing: false },
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

describe('useVenueOffersSearchNavigateTo', () => {
  it('should give the config according to the venue', () => {
    const { result } = renderHook(() => useVenueOffersSearchNavigateTo(venueResponseSnap.id))

    expect(result.current).toEqual({
      screen: 'TabNavigator',
      params: {
        screen: 'Search',
        params: {
          ...venueSearchParamsMock,
          previousView: SearchView.Results,
          view: SearchView.Results,
        },
      },
      withPush: true,
    })
  })
})
