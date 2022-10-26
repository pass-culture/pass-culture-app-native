import { useHasPosition } from 'features/search/components/useHasPosition'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { LocationFilter } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
  }),
}))

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const venue: SuggestedVenue = mockedSuggestedVenues[0]

let mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

describe('useLocationChoice', () => {
  it.each`
    locationType               | locationFilter                                                                   | position            | hasPositionValue
    ${LocationType.EVERYWHERE} | ${{ locationType: LocationType.EVERYWHERE }}                                     | ${DEFAULT_POSITION} | ${true}
    ${LocationType.EVERYWHERE} | ${{ locationType: LocationType.EVERYWHERE }}                                     | ${null}             | ${false}
    ${LocationType.AROUND_ME}  | ${{ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }}            | ${DEFAULT_POSITION} | ${true}
    ${LocationType.PLACE}      | ${{ locationType: LocationType.PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${DEFAULT_POSITION} | ${true}
    ${LocationType.PLACE}      | ${{ locationType: LocationType.PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${null}             | ${true}
    ${LocationType.VENUE}      | ${{ locationType: LocationType.VENUE, venue }}                                   | ${DEFAULT_POSITION} | ${true}
    ${LocationType.VENUE}      | ${{ locationType: LocationType.VENUE, venue }}                                   | ${null}             | ${true}
  `(
    'should return $hasPositionValue when location type is $locationType and position is $position',
    ({
      locationFilter,
      position,
      hasPositionValue,
    }: {
      locationFilter: LocationFilter
      position: GeoCoordinates | null
      hasPositionValue: boolean
    }) => {
      mockSearchState = { ...initialSearchState, locationFilter }
      mockPosition = position
      const hasPosition = useHasPosition()

      expect(hasPosition).toEqual(hasPositionValue)
    }
  )
})
