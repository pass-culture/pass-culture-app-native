import { VenueResponse } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { SearchView } from 'features/search/types'
import { venueResponseSnap as venue } from 'features/venue/fixtures/venueResponseSnap'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters/useVenueSearchParameters'
import { GeoCoordinates } from 'libs/geolocation'
import { renderHook } from 'tests/utils'

let mockPosition: GeoCoordinates | null = null
jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({ position: mockPosition })),
}))
const mockVenue: VenueResponse = venue
const invalidId = venue.id + 2
jest.mock('features/venue/api/useVenue', () => ({
  useVenue: jest.fn((venueId) => ({ data: venueId === mockVenue.id ? mockVenue : undefined })),
}))
jest.mock('features/search/helpers/useMaxPrice/useMaxPrice', () => ({
  useMaxPrice: jest.fn(() => 300),
}))

describe('useVenueSearchParameters', () => {
  it('should retrieve the default search parameters', () => {
    const { result } = renderHook(() => useVenueSearchParameters(invalidId))
    expect(result.current).toEqual({
      beginningDatetime: undefined,
      endingDatetime: undefined,
      hitsPerPage: 10,
      locationFilter: { locationType: LocationType.EVERYWHERE },
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
    })
  })

  it('should retrieve the locationFilter filtered on venue if available', () => {
    const { result } = renderHook(() => useVenueSearchParameters(venue.id))
    expect(result.current.locationFilter).toEqual({
      locationType: LocationType.VENUE,
      venue: {
        info: 'Paris',
        label: 'Le Petit Rintintin 1',
        geolocation: { latitude: venue.latitude, longitude: venue.longitude },
        venueId: 5543,
      },
    })
  })

  it('should retrieve the locationFilter filtered around me if no venue - position available', () => {
    mockPosition = { latitude: 48.8, longitude: 2.3 }
    const { result } = renderHook(() => useVenueSearchParameters(invalidId))
    expect(result.current.locationFilter).toEqual({
      aroundRadius: 100,
      locationType: LocationType.AROUND_ME,
    })
  })

  it('should retrieve the locationFilter filtered everywhere if no venue - position unavailable', () => {
    mockPosition = null
    const { result } = renderHook(() => useVenueSearchParameters(invalidId))
    expect(result.current.locationFilter).toEqual({
      locationType: LocationType.EVERYWHERE,
    })
  })
})
