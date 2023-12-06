import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place'

let mockGeolocPosition: Position = null
let mockPlace: SuggestedPlace | null = null
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockGeolocPosition,
    place: mockPlace,
  }),
}))

describe('useHomePosition', () => {
  afterEach(() => {
    mockPlace = null
    mockGeolocPosition = null
  })

  it.each`
    geolocPosition                   | placePosition                    | expectedPosition
    ${{ latitude: 1, longitude: 1 }} | ${{ latitude: 2, longitude: 2 }} | ${{ latitude: 2, longitude: 2 }}
    ${{ latitude: 1, longitude: 1 }} | ${null}                          | ${{ latitude: 1, longitude: 1 }}
  `(
    'returns $expectedPosition for geolocPosition : $geolocPosition and placePosition : $placePosition',
    ({ geolocPosition, placePosition, expectedPosition }) => {
      mockPlace = { geolocation: placePosition, label: 'label', info: 'info' }
      mockGeolocPosition = geolocPosition

      const { position } = useHomePosition()

      expect(position).toStrictEqual(expectedPosition)
    }
  )
})
