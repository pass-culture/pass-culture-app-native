import { initialSearchState } from 'features/search/context/reducer'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { useHasPosition } from 'features/search/helpers/useHasPosition/useHasPosition'
import { LocationFilter } from 'features/search/types'
import { GeoCoordinates, Position } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place'

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: Position = DEFAULT_POSITION

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
  }),
}))

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

let mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

describe('useLocationChoice', () => {
  it.each`
    loLocationMode.EVERYWHERE    | locationFilter    LocationMode.EVERYWHERE                                               | position            | hasPositionValue
    ${LocationMode.EVERYWHERE}   | ${{ locationType: LocationMode.EVERYWHERE }}                                            | ${DEFAULT_POSITION} | ${true}
    ${LocationMode.EVERYWHERE}   | ${{ locationType: LocationMode.EVERYWHERE }}                                            | ${null}             | ${false}
    ${LocationMode.AROUND_ME}    | ${{ locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS }}                   | ${DEFAULT_POSITION} | ${true}
    ${LocationMode.AROUND_PLACE} | ${{ locationType: LocationMode.AROUND_PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${DEFAULT_POSITION} | ${true}
    ${LocationMode.AROUND_PLACE} | ${{ locationType: LocationMode.AROUND_PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${null}             | ${true}
  `(
    'should return $hasPositionValue when location type is $locationType and position is $position',
    ({
      locationFilter,
      position,
      hasPositionValue,
    }: {
      locationFilter: LocationFilter
      position: Position
      hasPositionValue: boolean
    }) => {
      mockSearchState = { ...initialSearchState, locationFilter }
      mockPosition = position
      const hasPosition = useHasPosition()

      expect(hasPosition).toEqual(hasPositionValue)
    }
  )
})
