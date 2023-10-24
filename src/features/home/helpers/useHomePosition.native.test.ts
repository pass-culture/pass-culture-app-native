import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { Position } from 'libs/geolocation'

let mockUserPosition: Position = null
let mockCustomPosition: Position = null
jest.mock('libs/geolocation/LocationWrapper', () => ({
  useLocation: () => ({
    userPosition: mockUserPosition,
    customPosition: mockCustomPosition,
  }),
}))

describe('useHomePosition', () => {
  it.each`
    userPosition                     | customPosition                   | expectedPosition
    ${{ latitude: 1, longitude: 1 }} | ${{ latitude: 2, longitude: 2 }} | ${{ latitude: 2, longitude: 2 }}
    ${{ latitude: 1, longitude: 1 }} | ${null}                          | ${{ latitude: 1, longitude: 1 }}
  `(
    'returns $expectedPosition for userPosition : $userPosition and customPosition : $customPosition',
    ({ userPosition, customPosition, expectedPosition }) => {
      mockCustomPosition = customPosition
      mockUserPosition = userPosition

      const { position } = useHomePosition()

      expect(position).toStrictEqual(expectedPosition)
    }
  )
})
