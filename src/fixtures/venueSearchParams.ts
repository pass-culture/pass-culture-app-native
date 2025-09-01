import { SearchState } from 'features/search/types'
import mockVenueResponse from 'fixtures/venueResponse'
import { LocationMode } from 'libs/location/types'

export default {
  beginningDatetime: undefined,
  endingDatetime: undefined,
  hitsPerPage: 50,
  locationFilter: {
    locationType: LocationMode.EVERYWHERE,
  },
  venue: {
    label: mockVenueResponse.publicName || '',
    info: mockVenueResponse.city || '',
    _geoloc: {
      lat: mockVenueResponse.latitude,
      lng: mockVenueResponse.longitude,
    },
    venueId: mockVenueResponse.id,
    isOpenToPublic: true,
    venue_type: mockVenueResponse.venueTypeCode,
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
} satisfies SearchState
