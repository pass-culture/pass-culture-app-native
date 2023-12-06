import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place'

let mockUserPosition: Position = null
let mockPlace: SuggestedPlace | null = null
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userPosition: mockUserPosition,
    place: mockPlace,
  }),
}))

describe('useHomePosition', () => {
  afterEach(() => {
    mockPlace = null
    mockUserPosition = null
  })

  it.each`
    userPosition                     | placePosition                    | expectedPosition
    ${{ latitude: 1, longitude: 1 }} | ${{ latitude: 2, longitude: 2 }} | ${{ latitude: 2, longitude: 2 }}
    ${{ latitude: 1, longitude: 1 }} | ${null}                          | ${{ latitude: 1, longitude: 1 }}
  `(
    'returns $expectedPosition for userPosition : $userPosition and placePosition : $placePosition',
    ({ userPosition, placePosition, expectedPosition }) => {
      mockPlace = { geolocation: placePosition, label: 'label', info: 'info' }
      mockUserPosition = userPosition

      const { position } = useHomePosition()

      expect(position).toStrictEqual(expectedPosition)
    }
  )
})
