import { VenueResponse } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import { LocationMode } from 'libs/location/types'
import { renderHook } from 'tests/utils'

let mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: jest.fn() }),
}))

const mockVenue: VenueResponse = venueDataTest

jest.mock('features/venue/queries/useVenueQuery', () => ({
  useVenueQuery: jest.fn((venueId) => ({ data: venueId === mockVenue.id ? mockVenue : undefined })),
}))
jest.mock('features/search/helpers/useMaxPrice/useMaxPrice', () => ({
  useMaxPrice: jest.fn(() => 300_00),
}))

describe('useVenueSearchParameters', () => {
  afterEach(() => {
    mockSearchState = initialSearchState
  })

  it('should retrieve the default search parameters', () => {
    const { result } = renderHook(() => useVenueSearchParameters())

    expect(result.current).toEqual({
      beginningDatetime: undefined,
      endingDatetime: undefined,
      hitsPerPage: 50,
      locationFilter: { locationType: LocationMode.EVERYWHERE },
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
    })
  })

  it('should retrieve the the venue if available', () => {
    const { result } = renderHook(() => useVenueSearchParameters(venueDataTest))

    expect(result.current.venue).toEqual({
      info: 'Paris',
      label: 'Le Petit Rintintin 1',
      geolocation: { latitude: venueDataTest.latitude, longitude: venueDataTest.longitude },
      venueId: 5543,
    })
  })

  it('should retrieve the locationFilter filtered around me if no venue - position available', () => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: { aroundRadius: 100, locationType: LocationMode.AROUND_ME },
    }
    const { result } = renderHook(() => useVenueSearchParameters())

    expect(result.current.locationFilter).toEqual({
      aroundRadius: 100,
      locationType: LocationMode.AROUND_ME,
    })
  })

  it('should retrieve the locationFilter filtered everywhere if no venue - position unavailable', () => {
    const { result } = renderHook(() => useVenueSearchParameters())

    expect(result.current.locationFilter).toEqual({
      locationType: LocationMode.EVERYWHERE,
    })
  })
})
