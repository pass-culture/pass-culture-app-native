import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { useLocationType } from 'features/search/helpers/useLocationType/useLocationType'
import { SearchState } from 'features/search/types'
import { SuggestedPlace } from 'libs/place'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'

const mockSearchState = initialSearchState

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

describe('useLocationType', () => {
  it('should return search state location filter', () => {
    const { locationFilter } = useLocationType(mockSearchState)

    expect(locationFilter).toBe(mockSearchState.locationFilter)
  })

  it('should return search state location type', () => {
    const { locationType } = useLocationType(mockSearchState)

    expect(locationType).toBe(mockSearchState.locationFilter.locationType)
  })

  it('should return PLACE location type section when location type is VENUE', () => {
    const searchState: SearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.VENUE, venue: mockedSuggestedVenues[0] },
    }
    const { section } = useLocationType(searchState)

    expect(section).toBe(LocationType.PLACE)
  })

  it('should return PLACE location type section when location type is PLACE', () => {
    const searchState: SearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.PLACE, place: Kourou, aroundRadius: 100 },
    }
    const { section } = useLocationType(searchState)

    expect(section).toBe(LocationType.PLACE)
  })

  it.each`
    type
    ${LocationType.AROUND_ME}
    ${LocationType.EVERYWHERE}
  `('should return $type location type section when location type is $type', ({ locationType }) => {
    const searchState: SearchState = {
      ...initialSearchState,
      locationFilter: { locationType },
    }
    const { section } = useLocationType(searchState)

    expect(section).toBe(locationType)
  })
})
