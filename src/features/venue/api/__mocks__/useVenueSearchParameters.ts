import { LocationType } from "features/search/enums";
import { venueResponseSnap } from "features/venue/fixtures/venueResponseSnap";

const venueId = venueResponseSnap.id

export const useVenueSearchParameters = jest.fn()
.mockReturnValue({
  aroundRadius: null,
  beginningDatetime: null,
  endingDatetime: null,
  geolocation: null,
  hitsPerPage: 10,
  offerCategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  offerIsNew: false,
  offerTypes: { isDigital: false, isEvent: false, isThing: false },
  priceRange: [0, 300],
  locationType: LocationType.EVERYWHERE,
  tags: [],
  date: null,
  timeRange: null,
  venueId,
})
