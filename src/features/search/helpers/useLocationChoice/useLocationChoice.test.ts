import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { useLocationChoice } from 'features/search/helpers/useLocationChoice/useLocationChoice'
import { GeoCoordinates } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { BicolorAroundMe as AroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { BicolorLocationBuilding as LocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { BicolorLocationPointer as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer'

let mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

let mockPosition: GeoCoordinates | null = { latitude: 2, longitude: 40 }

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

describe('useLocationChoice', () => {
  it('should return an object with Everywhere icon, Partout label and isSelected boolean when position is not null when LocationType is EVERYWHERE', () => {
    const { Icon, label, isSelected } = useLocationChoice(LocationType.EVERYWHERE)

    expect(Icon).toEqual(Everywhere)
    expect(label).toEqual('Partout')
    expect(isSelected).toEqual(true)
  })

  it('should return an object with Everywhere icon, Me localiser label and isSelected boolean when position is null when LocationType is EVERYWHERE', () => {
    mockPosition = null
    const { Icon, label, isSelected } = useLocationChoice(LocationType.EVERYWHERE)

    expect(Icon).toEqual(Everywhere)
    expect(label).toEqual('')
    expect(isSelected).toEqual(true)
  })

  it('should return an object with AroundMe icon, Autour de moi label and isSelected boolean when LocationType is AROUND_ME', () => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS },
    }
    const { Icon, label, isSelected } = useLocationChoice(LocationType.AROUND_ME)

    expect(Icon).toEqual(AroundMe)
    expect(label).toEqual('Autour de moi')
    expect(isSelected).toEqual(true)
  })

  it('should return an object with LocationBuilding icon, name venue label and isSelected boolean when LocationType is PLACE withe venue', () => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.VENUE, venue },
    }
    const { Icon, label, isSelected } = useLocationChoice(LocationType.PLACE)

    expect(Icon).toEqual(LocationBuilding)
    expect(label).toEqual(venue.label)
    expect(isSelected).toEqual(true)
  })

  it('should return an object with LocationPointer icon, name place label and isSelected boolean when LocationType is PLACE with place', () => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.PLACE, place: Kourou, aroundRadius: MAX_RADIUS },
    }
    const { Icon, label, isSelected } = useLocationChoice(LocationType.PLACE)

    expect(Icon).toEqual(LocationPointer)
    expect(label).toEqual(Kourou.label)
    expect(isSelected).toEqual(true)
  })
})
